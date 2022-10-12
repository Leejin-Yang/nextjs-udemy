import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

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

interface Data {
  message: string
  subscribers?: SubscriberData[]
}

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const email = req.body.email

    const newSubscriber = {
      id: new Date().toISOString(),
      email,
    }

    const filePath = getSubscribersFilePath()
    const data = getFileData(filePath)
    data.push(newSubscriber)
    fs.writeFileSync(filePath, JSON.stringify(data))

    res.status(201).json({ message: 'Success!' })
  } else {
    const filePath = getSubscribersFilePath()
    const data = getFileData(filePath)
    res.status(200).json({ message: 'Success!', subscribers: data })
  }
}

export default handler
