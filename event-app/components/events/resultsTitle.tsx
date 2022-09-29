import Button from '../common/button'
import styles from './resultsTitle.module.css'

interface Props {
  date: Date
}

function ResultsTitle({ date }: Props) {
  const humanReadableDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <section className={styles.title}>
      <h1>Events in {humanReadableDate}</h1>
      <Button link='/events'>Show all events</Button>
    </section>
  )
}

export default ResultsTitle
