import { GetServerSidePropsContext } from 'next'

interface Props {
  userId: string
}

const UserIdPage = ({ userId }: Props) => {
  return <h1>{userId}</h1>
}

export default UserIdPage

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const { params } = context
  const userId = params?.uid

  return {
    props: {
      userId,
    },
  }
}
