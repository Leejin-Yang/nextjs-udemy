import { GetStaticProps } from 'next'
import Head from 'next/head'

import EventList from '../components/events/eventList'
import { Event, getFeaturedEvents } from '../services/events'

interface Props {
  events: Event[]
}

const HomePage = ({ events }: Props) => {
  return (
    <>
      <Head>
        <title>Featured Events | NextEvents </title>
        <meta
          name='description'
          content='Find a lot of great events that allow you to evolve.'
        />
      </Head>
      <EventList events={events} />
    </>
  )
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
