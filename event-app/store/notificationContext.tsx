import { createContext, ReactNode, useState } from 'react'

export interface Notification {
  title: string
  message: string
  status: string
}

interface NotificationContextObject {
  notification: Notification | null
  showNotification: (notificationData: Notification) => void
  hideNotification: () => void
}

export const NotificationContext = createContext<NotificationContextObject>({
  notification: null,
  showNotification: () => {},
  hideNotification: () => {},
})

interface Props {
  children: ReactNode
}

const NotificationContextProvider = ({ children }: Props) => {
  const [activeNotification, setActiveNotification] =
    useState<NotificationContextObject['notification']>(null)

  const showNotification = (notificationData: Notification) => {
    setActiveNotification(notificationData)
  }

  const hideNotification = () => {
    setActiveNotification(null)
  }

  const initialContext = {
    notification: activeNotification,
    showNotification,
    hideNotification,
  }

  return (
    <NotificationContext.Provider value={initialContext}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContextProvider
