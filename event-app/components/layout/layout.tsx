import { ReactNode, useContext } from 'react'

import { NotificationContext } from '../../store/notificationContext'

import Header from './header'
import Notification from './notification'

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  const { notification } = useContext(NotificationContext)

  return (
    <>
      <Header />
      <main>{children}</main>
      {notification && <Notification notification={notification} />}
    </>
  )
}

export default Layout
