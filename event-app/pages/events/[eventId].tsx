import { useRouter } from 'next/router'
import EventContent from '../../components/eventDetail/eventContent'
import EventLogistics from '../../components/eventDetail/eventLogistics'
import EventSummary from '../../components/eventDetail/eventSummary'
import { getEventById } from '../../data/dummy-data'

const EventDetailPage = () => {
  const router = useRouter()
  const { eventId } = router.query

  const event = getEventById(eventId as string)

  if (!event) {
    return <p>No event found!</p>
  }

  return (
    <>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </>
  )
}

export default EventDetailPage
