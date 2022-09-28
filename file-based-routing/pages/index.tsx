import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <h1>The Home Page</h1>
      <ul>
        <li>
          <Link href='/portfolio'>
            <a>Portfolio</a>
          </Link>
        </li>
        <li>
          <Link href='/clients'>
            <a>Clients</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Home
