import Link from 'next/link'
import type { DummyEvent } from '../../data/dummy-data'
import styles from './eventItem.module.css'

interface Props {
  event: DummyEvent
}

const EventItem = ({ event }: Props) => {
  const { title, image, date, location, id } = event

  const humanReadableDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedAddress = location.replace(', ', '\n')
  const exploreLink = `/events/${id}`

  return (
    <li className={styles.item}>
      <img src={`/${image}`} alt={title} />
      <div className={styles.content}>
        <div className={styles.summary}>
          <h2>{title}</h2>
          <div className={styles.date}>
            <time>{humanReadableDate}</time>
          </div>
          <div className={styles.address}>
            <address>{formattedAddress}</address>
          </div>
        </div>
        <div className={styles.actions}>
          <Link href={exploreLink}>
            <a>Explore Event</a>
          </Link>
        </div>
      </div>
    </li>
  )
}

export default EventItem
