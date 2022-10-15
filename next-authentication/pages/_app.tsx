import '../styles/globals.css'
import type { AppProps } from 'next/app'

import Layout from '../components/layout'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default MyApp
