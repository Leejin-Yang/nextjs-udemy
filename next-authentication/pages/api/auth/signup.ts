import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase, hashPassword } from '../../../lib'

const isValidEmail = (email: string) => email && email.includes('@')
const isValidPassword = (password: string) =>
  password && password.trim().length > 7

interface Data {
  message: string
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Invalid Request' })
    return
  }

  const body = req.body
  const { email, password } = body

  if (!isValidEmail(email)) {
    res.status(422).json({ message: 'Invalid email input' })
    return
  }

  if (!isValidPassword(password)) {
    res.status(422).json({
      message: 'Invalid password input - password should also be at least 7',
    })
    return
  }

  const client = await connectToDatabase()
  const db = client.db()

  const existingUser = await db.collection('users').findOne({ email })

  if (existingUser) {
    res.status(422).json({ message: 'User exists already' })
    return
  }

  const hashedPassword = await hashPassword(password)

  await db.collection('users').insertOne({ email, password: hashedPassword })

  res.status(201).json({ message: 'Create user!' })
}

export default handler
