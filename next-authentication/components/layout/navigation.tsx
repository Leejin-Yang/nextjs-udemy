import { useSession } from 'next-auth/react'
import Link from 'next/link'

import styles from './navigation.module.css'

function Navigation() {
  const { data: session, status } = useSession()

  console.log(session)
  console.log(status)

  return (
    <header className={styles.header}>
      <Link href='/'>
        <a>
          <div className={styles.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          {!session && (
            <li>
              <Link href='/auth'>Login</Link>
            </li>
          )}
          {status === 'authenticated' && (
            <li>
              <Link href='/profile'>Profile</Link>
            </li>
          )}
          {status === 'authenticated' && (
            <li>
              <button>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Navigation
