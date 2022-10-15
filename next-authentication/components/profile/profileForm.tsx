import { signOut } from 'next-auth/react'
import { FormEventHandler, useRef } from 'react'
import styles from './profileForm.module.css'
import type { PasswordData } from './userProfile'

interface Props {
  changePassword: ({ oldPassword, newPassword }: PasswordData) => void
}

function ProfileForm({ changePassword }: Props) {
  const newPasswordInputRef = useRef<HTMLInputElement>(null)
  const oldPasswordInputRef = useRef<HTMLInputElement>(null)

  const onPasswordChangeSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    const enteredOldPassword = oldPasswordInputRef.current?.value
    const enteredNewPassword = newPasswordInputRef.current?.value

    // validation
    if (!enteredOldPassword || !enteredNewPassword) return

    changePassword({
      oldPassword: enteredOldPassword,
      newPassword: enteredNewPassword,
    })

    signOut()
  }

  return (
    <form className={styles.form} onSubmit={onPasswordChangeSubmit}>
      <div className={styles.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordInputRef} />
      </div>
      <div className={styles.control}>
        <label htmlFor='old-password'>Old Password</label>
        <input type='password' id='old-password' ref={oldPasswordInputRef} />
      </div>
      <div className={styles.action}>
        <button>Change Password</button>
      </div>
    </form>
  )
}

export default ProfileForm
