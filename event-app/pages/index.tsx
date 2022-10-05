import { GetStaticProps } from 'next'

import EventList from '../components/events/eventList'
import { Event, getFeaturedEvents } from '../services/events'

interface Props {
  events: Event[]
}

const HomePage = ({ events }: Props) => {
  return <EventList events={events} />
}

export default HomePage

export const getStaticProps: GetStaticProps = async () => {
  const featuredEvents = await getFeaturedEvents()

  return {
    props: {
      events: featuredEvents,
    },
    revalidate: 1800,
  }
}
