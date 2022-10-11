import { FormEventHandler, useRef, useState } from 'react'
import type { FeedbackData } from './api/feedback'

const Home = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackData[]>([])

  const emailInputRef = useRef<HTMLInputElement>(null)
  const feedbackInputRef = useRef<HTMLTextAreaElement>(null)

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    const enteredEmail = emailInputRef.current?.value
    const enteredFeedback = feedbackInputRef.current?.value

    if (!enteredEmail || !enteredFeedback) return

    const reqBody = { email: enteredEmail, feedback: enteredFeedback }

    fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
  }

  const onLoadFeedbackClick = () => {
    fetch('/api/feedback')
      .then((res) => res.json())
      .then((data) => {
        setFeedbackList(data.feedback)
      })
  }

  return (
    <div>
      <h1>The Home Page</h1>
      <form onSubmit={onFormSubmit}>
        <div>
          <label htmlFor='email'>Your Email Address</label>
          <input type='email' id='email' ref={emailInputRef} />
        </div>
        <div>
          <label htmlFor='feedback'>Your Feedback</label>
          <textarea id='feedback' rows={5} ref={feedbackInputRef} />
        </div>
        <button type='submit'>Send Feedback</button>
      </form>
      <hr />
      <button type='button' onClick={onLoadFeedbackClick}>
        Load Feedback
      </button>
      <ul>
        {feedbackList.map((item) => (
          <li key={item.id}>{item.feedback}</li>
        ))}
      </ul>
    </div>
  )
}

export default Home
