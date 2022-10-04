import { GetServerSideProps } from 'next'

interface Props {
  userName: string
}

const UserProfilePage = ({ userName }: Props) => {
  return <h1>{userName}</h1>
}

export default UserProfilePage

export const getServerSideProps = () => {
  return {
    props: {
      userName: 'Max',
    },
  }
}
