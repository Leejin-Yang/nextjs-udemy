import { useContext, useEffect, useState } from 'react'

import CommentList from './commentList'
import NewComment from './newComment'
import classes from './comments.module.css'
import { NotificationContext } from '../../store/notificationContext'

interface Props {
  eventId: string
}

function Comments({ eventId }: Props) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { showNotification } = useContext(NotificationContext)

  useEffect(() => {
    if (!showComments) return

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/${eventId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong')
        }

        setComments(data.comments)
      } catch (error: any) {
        setIsError(true)
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    fetchComments()
  }, [eventId, showComments])

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus)
  }

  async function addCommentHandler(commentData: any) {
    showNotification({
      title: 'Sending Comment',
      message: 'Post your comment',
      status: 'pending',
    })

    try {
      const response = await fetch(`/api/comments/${eventId}`, {
        method: 'POST',
        body: JSON.stringify(commentData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      showNotification({
        title: 'Success!',
        message: data.message,
        status: 'success',
      })
      setComments((prev) => [data.comments, ...prev])
    } catch (error: any) {
      showNotification({
        title: 'Error!',
        message: error.message || 'Something went wrong!',
        status: 'error',
      })
    }
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && isLoading && <p>Loading...</p>}
      {showComments && !isLoading && isError && <p>{errorMessage}</p>}
      {showComments && !isLoading && !isError && (
        <CommentList comments={comments} />
      )}
    </section>
  )
}

export default Comments
