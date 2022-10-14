import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import UserProfile from '../components/profile/userProfile'

function ProfilePage() {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/auth')
    },
  })

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  return <UserProfile />
}

export default ProfilePage

//ProfilePage.auth = {
//  role: 'user-profile',
//  loading: <p>Loading...</p>,
//  unauthorized: '/auth',
//}
