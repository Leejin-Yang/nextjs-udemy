import ProfileForm from './profileForm'
import styles from './userProfile.module.css'

function UserProfile() {
  // Redirect away if NOT auth

  return (
    <section className={styles.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  )
}

export default UserProfile
