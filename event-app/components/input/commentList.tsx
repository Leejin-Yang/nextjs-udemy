import classes from './commentList.module.css'

interface Props {
  comments: any[]
}

function CommentList({ comments }: Props) {
  return (
    <ul className={classes.comments}>
      {comments?.map((comment) => (
        <li key={comment.id}>
          <p>{comment.text}</p>
          <div>
            By <address>{comment.name}</address>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default CommentList
