import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'

import {
  connectDB,
  getAllDocuments,
  insertDocument,
} from '../../../services/eventsDb'

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

  let client

  try {
    client = await connectDB()
  } catch (error) {
    res.status(500).json({ message: 'Inserting data failed!' })
    return
  }

  if (req.method === 'POST') {
    const { email, name, text } = req.body

    if (!isValidEmail(email) || !isValidText(name) || !isValidText(text)) {
      res.status(422).json({ message: 'Invalid input.' })
      client.close()
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
    try {
      await insertDocument(client, 'comments', newComment)
      //newComment._id = result.insertedId
      res
        .status(201)
        .json({ message: 'Success to add comment!', comments: newComment })
    } catch (error) {
      res.status(500).json({ message: 'Inserting data failed!' })
    }
  }

  if (req.method === 'GET') {
    //파일에 저장
    //const filePath = getCommentsFilePath()
    //const data = getFileData(filePath) as Comments[]
    //const selectedData = data.find((item) => item.id === eventId)

    //MongoDB

    try {
      const comments = await getAllDocuments(
        client,
        'comments',
        { eventId },
        { _id: -1 }
      )
      res.status(200).json({ message: 'Success to load comments!', comments })
    } catch (error) {
      res.status(500).json({ message: 'Getting comments failed!' })
    }
  }

  client.close()
}

export default handler
