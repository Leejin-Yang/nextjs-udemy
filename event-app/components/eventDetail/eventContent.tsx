import { ReactNode } from 'react'
import styles from './eventContent.module.css'

interface Props {
  children: ReactNode
}

function EventContent({ children }: Props) {
  return <section className={styles.content}>{children}</section>
}

export default EventContent
