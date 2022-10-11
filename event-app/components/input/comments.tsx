import { useState } from 'react'

import CommentList from './commentList'
import NewComment from './newComment'
import classes from './comments.module.css'

interface Props {
  eventId: string
}

function Comments({ eventId }: Props) {
  const [showComments, setShowComments] = useState(false)

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus)
  }

  function addCommentHandler(commentData: any) {
    // send data to API
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && <CommentList />}
    </section>
  )
}

export default Comments
