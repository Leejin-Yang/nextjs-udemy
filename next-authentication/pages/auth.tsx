//import { useSession } from 'next-auth/react'
//import { useRouter } from 'next/router'
//import { useEffect } from 'react'
import AuthForm from '../components/auth/authForm'

function AuthPage() {
  //세션이 있는 경우 redirect 생각해보자
  //const { status } = useSession()
  //const router = useRouter()

  //useEffect(() => {
  //  if (status === 'authenticated') {
  //    router.replace('/')
  //  }
  //}, [router, status])

  //if (status === 'loading') {
  //  return <p>Loading...</p>
  //}

  //if (status === 'authenticated') {
  //  return <p>Already log in</p>
  //}

  return <AuthForm />
}

export default AuthPage
