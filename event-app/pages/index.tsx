import EventList from '../components/events/eventList'
import EventSearch from '../components/events/eventSearch'
import { getFeaturedEvents } from '../data/dummy-data'

const HomePage = () => {
  const featuredEvents = getFeaturedEvents()

  return <EventList events={featuredEvents} />
}

export default HomePage
