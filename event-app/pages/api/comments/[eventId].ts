import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'

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

function handler(req: NextApiRequest, res: NextApiResponse<Data<any>>) {
  const eventId = req.query.eventId

  if (typeof eventId !== 'string') return

  if (req.method === 'POST') {
    const { email, name, text } = req.body

    if (!isValidEmail(email) || !isValidText(name) || !isValidText(text)) {
      res.status(422).json({ message: 'Invalid input.' })
      return
    }

    const newComment = {
      id: new Date().toISOString(),
      email,
      name,
      text,
    }

    const filePath = getCommentsFilePath()
    const data = getFileData(filePath) as Comments[]
    const selectedData = data.find((item) => item.id === eventId)

    if (!selectedData) {
      data.push({ id: eventId, comments: [newComment] })
    }

    selectedData?.comments.push(newComment)

    fs.writeFileSync(filePath, JSON.stringify(data))
    res
      .status(201)
      .json({ message: 'Success to comment!', comments: newComment })
  }

  if (req.method === 'GET') {
    const filePath = getCommentsFilePath()
    const data = getFileData(filePath) as Comments[]
    const selectedData = data.find((item) => item.id === eventId)

    res
      .status(200)
      .json({ message: 'Success!', comments: selectedData?.comments })
  }
}

export default handler
