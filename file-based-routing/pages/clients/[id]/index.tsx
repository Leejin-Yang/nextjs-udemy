import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const ClientProjects: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const onProjectClick = () => {
    // load data...
    router.push(`/clients/${id}/projectA`)
    // or
    // router.replace(`/clients/${id}/projectA`)
  }

  return (
    <div>
      <h1>The Client Projects Page</h1>
      <button type='button' onClick={onProjectClick}>
        Load Project A
      </button>
    </div>
  )
}

export default ClientProjects
