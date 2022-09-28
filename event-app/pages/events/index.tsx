import EventList from '../../components/events/eventList'
import { getAllEvents } from '../../data/dummy-data'

const AllEventsPage = () => {
  const events = getAllEvents()

  return (
    <div>
      <EventList events={events} />
    </div>
  )
}

export default AllEventsPage
