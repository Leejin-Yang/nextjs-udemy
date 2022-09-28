import { ReactNode } from 'react'
import Link from 'next/link'
import styles from './button.module.css'

interface Props {
  children: ReactNode
  link: string
}

const Button = ({ children, link }: Props) => {
  return (
    <Link href={link}>
      <a className={styles.btn}>{children}</a>
    </Link>
  )
}

export default Button
