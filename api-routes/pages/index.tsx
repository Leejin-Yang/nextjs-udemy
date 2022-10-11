import { FormEventHandler, useRef } from 'react'

const Home = () => {
  const emailInputRef = useRef<HTMLInputElement>(null)
  const feedbackInputRef = useRef<HTMLTextAreaElement>(null)

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    const enteredEmail = emailInputRef.current?.value
    const enteredFeedback = feedbackInputRef.current?.value

    // fetch() // { email: 'aaa@mail.com', feedback: 'some feedback' }
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
