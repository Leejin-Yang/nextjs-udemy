import { ReactNode } from 'react'
import styles from './logisticsItem.module.css'

interface Props {
  icon: () => JSX.Element
  children: ReactNode
}

function LogisticsItem({ icon: Icon, children }: Props) {
  return (
    <li className={styles.item}>
      <span className={styles.icon}>
        <Icon />
      </span>
      <span className={styles.content}>{children}</span>
    </li>
  )
}

export default LogisticsItem
