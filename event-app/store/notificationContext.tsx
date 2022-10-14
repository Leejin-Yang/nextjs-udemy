import { createContext, ReactNode, useEffect, useState } from 'react'

export interface Notification {
  title: string
  message: string
  status: 'success' | 'error' | 'pending'
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

  useEffect(() => {
    if (!activeNotification || activeNotification.status === 'pending') return

    const timer = setTimeout(() => {
      setActiveNotification(null)
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [activeNotification])

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
