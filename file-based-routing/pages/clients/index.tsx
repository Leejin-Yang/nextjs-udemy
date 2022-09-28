import type { NextPage } from 'next'
import Link from 'next/link'

const CLIENTS = [
  { id: 'leejin', name: 'Leejin' },
  { id: 'resource', name: 'Resource' },
  { id: 'horong', name: 'Horong' },
]

const Clients: NextPage = () => {
  return (
    <div>
      <h1>The Clients Page</h1>
      <ul>
        {CLIENTS.map((client) => (
          <li key={`client-${client.id}`}>
            <Link href={`/clients/${client.id}`}>
              <a>{client.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Clients
