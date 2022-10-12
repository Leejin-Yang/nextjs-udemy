import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import { MongoClient } from 'mongodb'

export function getCommentsFilePath() {
  return path.join(process.cwd(), 'data', 'comments.json')
}

export function getFileData(filePath: string) {
  const fileData = fs.readFileSync(filePath, { encoding: 'utf-8' })
  const data = JSON.parse(fileData)

  return data
}

interface Comments {
  id: string
  comments: any[]
}

interface CommentData {
  email: string
  name: string
  text: string
}

interface Data<T> {
  message: string
  comments?: T | T[]
}

const isValidEmail = (email: any) => email && email.includes('@')
const isValidText = (text: any) => text && text.trim() !== ''

async function handler(req: NextApiRequest, res: NextApiResponse<Data<any>>) {
  const eventId = req.query.eventId

  if (typeof eventId !== 'string') return

  const client = await MongoClient.connect(
    `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.dixjhgb.mongodb.net/events?retryWrites=true&w=majority`
  )

  if (req.method === 'POST') {
    const { email, name, text } = req.body

    if (!isValidEmail(email) || !isValidText(name) || !isValidText(text)) {
      res.status(422).json({ message: 'Invalid input.' })
      return
    }

    const newComment = {
      email,
      name,
      text,
      eventId,
    }

    //파일에 저장
    //const filePath = getCommentsFilePath()
    //const data = getFileData(filePath) as Comments[]
    //const selectedData = data.find((item) => item.id === eventId)

    //if (!selectedData) {
    //  data.push({ id: eventId, comments: [newComment] })
    //}

    //selectedData?.comments.push(newComment)

    //fs.writeFileSync(filePath, JSON.stringify(data))

    const db = client.db()
    const result = await db.collection('comments').insertOne(newComment)

    //newComment.id = result.insertedId

    res
      .status(201)
      .json({ message: 'Success to add comment!', comments: newComment })
  }

  if (req.method === 'GET') {
    //파일에 저장
    //const filePath = getCommentsFilePath()
    //const data = getFileData(filePath) as Comments[]
    //const selectedData = data.find((item) => item.id === eventId)

    //MongoDB
    const db = client.db()
    const comments = await db
      .collection('comments')
      .find({ eventId })
      .sort({ _id: -1 }) // 내림차순
      .toArray()

    res.status(200).json({ message: 'Success to load comments!', comments })
  }

  client.close()
}

export default handler
