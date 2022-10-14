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

  const { showNotification } = useContext(NotificationContext)

  useEffect(() => {
    if (!showComments) return

    fetch(`/api/comments/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments)
      })
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
      {showComments && <CommentList comments={comments} />}
    </section>
  )
}

export default Comments
