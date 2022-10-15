import { NextComponentType, NextPageContext } from 'next'
import { useSession } from 'next-auth/react'
import { ReactElement, ReactNode } from 'react'

interface Props {
  children: ReactElement | null
}

function Auth({ children }: Props) {
  const { status } = useSession({ required: true })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return children
}

export default Auth
