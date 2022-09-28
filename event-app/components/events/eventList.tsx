import type { DummyEvent } from '../../data/dummy-data'
import EventItem from './eventItem'

interface Props {
  events: DummyEvent[]
}

const EventList = ({ events }: Props) => {
  return (
    <ul>
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </ul>
  )
}

export default EventList
