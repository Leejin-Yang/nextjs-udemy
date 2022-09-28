import type { DummyEvent } from '../../data/dummy-data'
import EventItem from './eventItem'
import styles from './eventList.module.css'

interface Props {
  events: DummyEvent[]
}

const EventList = ({ events }: Props) => {
  return (
    <ul className={styles.list}>
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </ul>
  )
}

export default EventList
