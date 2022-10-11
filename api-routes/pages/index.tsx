import { FormEventHandler, useRef } from 'react'

const Home = () => {
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
    </div>
  )
}

export default Home
