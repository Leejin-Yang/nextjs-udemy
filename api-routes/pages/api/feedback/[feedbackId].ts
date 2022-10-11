import type { NextApiRequest, NextApiResponse } from 'next'

import { getFileData, getFilePath } from '.'
import type { FeedbackData } from '.'

interface Data {
  message: string
  feedback: FeedbackData | null
}

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'DELETE') {
    // 특정 id에 대해 DELETE 요청이 들어왔을 때
  }

  const feedbackId = req.query.feedbackId

  const filePath = getFilePath()
  const data = getFileData(filePath)
  const selectedFeedback = data.find(
    (item) => item.id === (feedbackId as string)
  )

  if (!selectedFeedback) {
    res.status(200).json({ message: 'Fail', feedback: null })
    return
  }

  res.status(200).json({ message: 'Success!', feedback: selectedFeedback })
}

export default handler
