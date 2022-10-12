import { useEffect, useState } from 'react'

import CommentList from './commentList'
import NewComment from './newComment'
import classes from './comments.module.css'

interface Props {
  eventId: string
}

function Comments({ eventId }: Props) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])

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

  function addCommentHandler(commentData: any) {
    fetch(`/api/comments/${eventId}`, {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
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
