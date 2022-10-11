import fs from 'fs'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  message: string
  feedback: FeedbackData
}

interface FeedbackData {
  id: string
  email: string
  feedback: string
}

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const email = req.body.email
    const feedback = req.body.feedback

    const newFeedback = {
      id: new Date().toISOString(),
      email,
      feedback,
    }

    // 그리고 이 객체를 DB나 파일에 저장한다.
    // 여기서는 파일에 저장해본다.
    const filePath = path.join(process.cwd(), 'data', 'feedback.json')
    const fileData = fs.readFileSync(filePath, { encoding: 'utf-8' }) // json 데이터
    const data = JSON.parse(fileData) as FeedbackData[]
    data.push(newFeedback)
    fs.writeFileSync(filePath, JSON.stringify(data))

    res.status(201).json({ message: 'Success!', feedback: newFeedback })
  } else {
    //  res.status(200).json({ message: 'This works!' })
  }
}

export default handler
