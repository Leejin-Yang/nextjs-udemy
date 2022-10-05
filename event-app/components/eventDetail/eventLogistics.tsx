import AddressIcon from '../svgs/addressIcon'
import DateIcon from '../svgs/dateIcon'
import LogisticsItem from './logisticsItem'
import styles from './eventLogistics.module.css'
import Image from 'next/image'

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
        <Image src={`/${image}`} alt={imageAlt} width={400} height={400} />
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
