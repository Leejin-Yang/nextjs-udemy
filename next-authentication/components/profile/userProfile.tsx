import ProfileForm from './profileForm'
import styles from './userProfile.module.css'

export interface PasswordData {
  oldPassword: string
  newPassword: string
}

function UserProfile() {
  const changePassword = async (passwordData: PasswordData) => {
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PATCH',
        body: JSON.stringify(passwordData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      console.log(data)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  return (
    <section className={styles.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm changePassword={changePassword} />
    </section>
  )
}

export default UserProfile
