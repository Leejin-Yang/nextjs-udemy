import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { MongoClient } from 'mongodb'

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
    const client = await MongoClient.connect(
      `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.dixjhgb.mongodb.net/events?retryWrites=true&w=majority`
    )
    const db = client.db()

    await db.collection('subscribers').insertOne({ email })

    client.close()

    res.status(201).json({ message: 'Success!' })
  }
}

export default handler
