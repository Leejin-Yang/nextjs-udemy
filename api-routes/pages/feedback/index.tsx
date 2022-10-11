import type { GetStaticProps } from 'next'
import { useState } from 'react'

import { getFileData, getFilePath } from '../api/feedback'
import type { FeedbackData } from '../api/feedback'

interface Props {
  feedbackList: FeedbackData[]
}

const FeedbackPage = ({ feedbackList }: Props) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData>()

  const onFeedbackClick = (id: string) => {
    fetch(`/api/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFeedbackData(data.feedback)
      })
  }

  return (
    <>
      {feedbackData && <p>{feedbackData.email}</p>}
      <ul>
        {feedbackList.map((item) => (
          <li key={item.id}>
            <button type='button' onClick={onFeedbackClick.bind(null, item.id)}>
              {item.feedback}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default FeedbackPage

export const getStaticProps: GetStaticProps = async () => {
  const filePath = getFilePath()
  const data = getFileData(filePath)

  return {
    props: { feedbackList: data },
  }
}
