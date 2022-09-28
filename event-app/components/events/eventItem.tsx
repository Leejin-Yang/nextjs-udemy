import Link from 'next/link'
import type { DummyEvent } from '../../data/dummy-data'

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
    <li>
      <img src={`/${image}`} alt={title} />
      <div>
        <div>
          <h2>{title}</h2>
          <div>
            <time>{humanReadableDate}</time>
          </div>
          <div>
            <address>{formattedAddress}</address>
          </div>
        </div>
        <div>
          <Link href={exploreLink}>
            <a>Explore Event</a>
          </Link>
        </div>
      </div>
    </li>
  )
}

export default EventItem
