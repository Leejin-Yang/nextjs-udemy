import { GetStaticProps } from 'next'

import { getFileData, getFilePath } from '../api/feedback'
import type { FeedbackData } from '../api/feedback'

interface Props {
  feedbackList: FeedbackData[]
}

const FeedbackPage = ({ feedbackList }: Props) => {
  return (
    <ul>
      {feedbackList.map((item) => (
        <li key={item.id}>{item.feedback}</li>
      ))}
    </ul>
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
