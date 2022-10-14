import { useContext, useRef } from 'react'
import type { FormEventHandler } from 'react'
import classes from './newsletterRegistration.module.css'

import { NotificationContext } from '../../store/notificationContext'

function NewsletterRegistration() {
  const emailInputRef = useRef<HTMLInputElement>(null)
  const { showNotification } = useContext(NotificationContext)

  const registrationHandler: FormEventHandler = async (e) => {
    e.preventDefault()

    const enteredEmail = emailInputRef.current?.value

    if (!enteredEmail) return

    showNotification({
      title: 'Signing Up...',
      message: 'Registering for newsletter',
      status: 'pending',
    })

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        body: JSON.stringify({ email: enteredEmail }),
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
    } catch (error: any) {
      showNotification({
        title: 'Error!',
        message: error.message || 'Something went wrong!',
        status: 'error',
      })
    }
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
