import { GetStaticPaths, GetStaticProps } from 'next'

import EventContent from '../../components/eventDetail/eventContent'
import EventLogistics from '../../components/eventDetail/eventLogistics'
import EventSummary from '../../components/eventDetail/eventSummary'
import { Event, getEventById, getFeaturedEvents } from '../../services/events'

interface Props {
  event: Event
}

const EventDetailPage = ({ event }: Props) => {
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

export const getStaticPaths: GetStaticPaths = async () => {
  const allEvents = await getFeaturedEvents()
  const paths = allEvents.map((event) => ({ params: { eventId: event.id } }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context
  const event = await getEventById(params?.eventId as string)

  if (!event) {
    return {
      notFound: true,
    }
  }

  return {
    props: { event },
    revalidate: 30,
  }
}
