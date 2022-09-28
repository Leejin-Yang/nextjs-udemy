import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const SelectedClientProject: NextPage = () => {
  const router = useRouter()

  console.log(router.query)

  return (
    <div>
      <h1>The Client Selected Project Page</h1>
    </div>
  )
}

export default SelectedClientProject
