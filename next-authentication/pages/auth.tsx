import { GetServerSidePropsContext } from 'next'
import { unstable_getServerSession } from 'next-auth'
import AuthForm from '../components/auth/authForm'
import { authOptions } from './api/auth/[...nextauth]'

function AuthPage() {
  return <AuthForm />
}

export default AuthPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
