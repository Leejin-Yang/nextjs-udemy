import AddressIcon from '../svgs/addressIcon'
import DateIcon from '../svgs/dateIcon'
import LogisticsItem from './logisticsItem'
import styles from './eventLogistics.module.css'

interface Props {
  date: string
  address: string
  image: string
  imageAlt: string
}

function EventLogistics({ date, address, image, imageAlt }: Props) {
  const humanReadableDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const addressText = address.replace(', ', '\n')

  return (
    <section className={styles.logistics}>
      <div className={styles.image}>
        <img src={`/${image}`} alt={imageAlt} />
      </div>
      <ul className={styles.list}>
        <LogisticsItem icon={DateIcon}>
          <time>{humanReadableDate}</time>
        </LogisticsItem>
        <LogisticsItem icon={AddressIcon}>
          <address>{addressText}</address>
        </LogisticsItem>
      </ul>
    </section>
  )
}

export default EventLogistics
