import { ReactNode } from 'react'
import styles from './errorAlert.module.css'

interface Props {
  children: ReactNode
}

function ErrorAlert({ children }: Props) {
  return <div className={styles.alert}>{children}</div>
}

export default ErrorAlert
