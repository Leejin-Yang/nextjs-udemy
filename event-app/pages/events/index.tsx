import { useRouter } from 'next/router'
import EventList from '../../components/events/eventList'
import EventSearch from '../../components/events/eventSearch'
import { getAllEvents } from '../../data/dummy-data'

const AllEventsPage = () => {
  const router = useRouter()
  const events = getAllEvents()

  const filterEvent = (year: string, month: string) => {
    const fullPath = `/events/${year}/${month}`

    router.push(fullPath)
  }

  return (
    <>
      <EventSearch onSearch={filterEvent} />
      <EventList events={events} />
    </>
  )
}

export default AllEventsPage
