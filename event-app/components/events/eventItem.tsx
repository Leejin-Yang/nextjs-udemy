import Image from 'next/image'
import type { DummyEvent } from '../../data/dummy-data'
import Button from '../common/button'
import AddressIcon from '../svgs/addressIcon'
import ArrowRightIcon from '../svgs/arrowRightIcon'
import DateIcon from '../svgs/dateIcon'
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
      <Image src={`/${image}`} alt={title} width={250} height={160} />
      <div className={styles.content}>
        <div className={styles.summary}>
          <h2>{title}</h2>
          <div className={styles.date}>
            <DateIcon />
            <time>{humanReadableDate}</time>
          </div>
          <div className={styles.address}>
            <AddressIcon />
            <address>{formattedAddress}</address>
          </div>
        </div>
        <div className={styles.actions}>
          <Button link={exploreLink}>
            <span>Explore Event</span>
            <span className={styles.icon}>
              <ArrowRightIcon />
            </span>
          </Button>
        </div>
      </div>
    </li>
  )
}

export default EventItem
