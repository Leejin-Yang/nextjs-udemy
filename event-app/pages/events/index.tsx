import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import EventList from '../../components/events/eventList'
import EventSearch from '../../components/events/eventSearch'
import { Event, getAllEvents } from '../../services/events'

interface Props {
  events: Event[]
}

const AllEventsPage = ({ events }: Props) => {
  const router = useRouter()

  const filterEvent = (year: string, month: string) => {
    const fullPath = `/events/${year}/${month}`

    router.push(fullPath)
  }

  return (
    <>
      <Head>
        <title>All Events | NextEvents</title>
        <meta
          name='description'
          content='Find a lot of great events that allow you to evolve.'
        />
      </Head>
      <EventSearch onSearch={filterEvent} />
      <EventList events={events} />
    </>
  )
}

export default AllEventsPage

export const getStaticProps: GetStaticProps = async () => {
  const events = await getAllEvents()

  return {
    props: {
      events,
    },
    revalidate: 60,
  }
}
