import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

import { connectDB, insertDocument } from '../../services/eventsDb'

interface SubscriberData {
  id: string
  email: string
}

export function getSubscribersFilePath() {
  return path.join(process.cwd(), 'data', 'subscribers.json')
}

export function getFileData(filePath: string) {
  const fileData = fs.readFileSync(filePath, { encoding: 'utf-8' })
  const data = JSON.parse(fileData)

  return data
}

const isValidEmail = (email: any) => email && email.includes('@')

interface Data {
  message: string
  subscribers?: SubscriberData[]
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const email = req.body.email

    if (!isValidEmail) {
      res.status(422).json({ message: 'Invalid email address' })
      return
    }

    //const newSubscriber = {
    //  id: new Date().toISOString(),
    //  email,
    //}

    //파일을 이용해 저장
    //const filePath = getSubscribersFilePath()
    //const data = getFileData(filePath)
    //data.push(newSubscriber)
    //fs.writeFileSync(filePath, JSON.stringify(data))

    //MongoDB
    let client

    try {
      client = await connectDB()
    } catch (error) {
      res.status(500).json({ message: 'Connecting to the database failed!' })
      return
    }

    try {
      insertDocument(client, 'subscriber', { email })
      client.close()
    } catch (error) {
      res.status(500).json({ message: 'Inserting data failed!' })
      return
    }

    res.status(201).json({ message: 'Successfully registered for newsletter' })
  }
}

export default handler
