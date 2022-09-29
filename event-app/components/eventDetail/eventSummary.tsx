import type { DummyEvent } from '../../data/dummy-data'
import styles from './eventSummary.module.css'

interface Props {
  title: DummyEvent['title']
}

const EventSummary = ({ title }: Props) => {
  return (
    <section className={styles.summary}>
      <h1>{title}</h1>
    </section>
  )
}

export default EventSummary
