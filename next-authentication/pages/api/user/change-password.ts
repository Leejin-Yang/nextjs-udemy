import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { connectToDatabase, hashPassword, verifyPassword } from '../../../lib'
import { authOptions } from '../auth/[...nextauth]'

interface Data {
  message: string
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'PATCH') {
    res.status(400).json({ message: 'Invalid Request' })
    return
  }

  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' })
    return
  }

  const userEmail = session.user?.email
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword

  const client = await connectToDatabase()
  const usersCollection = client.db().collection('users')
  const user = await usersCollection.findOne({ email: userEmail })

  if (!user) {
    res.status(404).json({ message: 'User not found!' })
    client.close()
    return
  }

  const currentPassword = user.password
  const isPasswordEqual = await verifyPassword(oldPassword, currentPassword)

  if (!isPasswordEqual) {
    res.status(403).json({ message: "Password's not correct" })
    client.close()
    return
  }

  const hashedPassword = await hashPassword(newPassword)
  await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  )

  client.close()
  res.status(200).json({ message: 'Password updated!' })
}

export default handler
