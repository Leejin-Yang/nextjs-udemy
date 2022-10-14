import Link from 'next/link'

import styles from './navigation.module.css'

function Navigation() {
  return (
    <header className={styles.header}>
      <Link href='/'>
        <a>
          <div className={styles.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          <li>
            <Link href='/auth'>Login</Link>
          </li>
          <li>
            <Link href='/profile'>Profile</Link>
          </li>
          <li>
            <button>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navigation
