import { useRef } from 'react'
import type { FormEventHandler } from 'react'
import classes from './newsletterRegistration.module.css'

function NewsletterRegistration() {
  const emailInputRef = useRef<HTMLInputElement>(null)

  const registrationHandler: FormEventHandler = (e) => {
    e.preventDefault()

    const enteredEmail = emailInputRef.current?.value

    if (!enteredEmail) return

    fetch('/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email: enteredEmail }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type='email'
            id='email'
            placeholder='Your email'
            aria-label='Your email'
            ref={emailInputRef}
          />
          <button>Register</button>
        </div>
      </form>
    </section>
  )
}

export default NewsletterRegistration
