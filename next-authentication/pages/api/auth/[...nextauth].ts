import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase, verifyPassword } from '../../../lib'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'email-password-credential',
      async authorize(credentials: { email: string; password: string }) {
        const client = await connectToDatabase()

        const usersCollection = client.db().collection('users')
        const user = await usersCollection.findOne({
          email: credentials?.email,
        })

        if (!user) {
          client.close()
          throw new Error('No user found')
        }

        const isValid = await verifyPassword(
          credentials?.password,
          user.password
        )

        if (!isValid) {
          client.close()
          throw new Error('Could not log you in')
        }

        client.close()
        return { email: user.email }
      },
    }),
  ],
}

export default NextAuth(authOptions)
