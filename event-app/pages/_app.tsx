import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/layout'
import Head from 'next/head'

import NotificationContextProvider from '../store/notificationContext'
import Notification from '../components/common/notification'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NotificationContextProvider>
      <Layout>
        <Head>
          <title>NextEvents</title>
          <meta name='description' content='Next Events' />
          <meta
            name='viewport'
            content='initial-scale=1.0, width=device-width'
          />
        </Head>
        <Component {...pageProps} />
        <Notification title='test' message='This is Test' status='pending' />
      </Layout>
    </NotificationContextProvider>
  )
}

export default MyApp
