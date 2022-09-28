import EventList from '../components/events/eventList'
import { getFeaturedEvents } from '../data/dummy-data'

const HomePage = () => {
  const featuredEvents = getFeaturedEvents()

  return (
    <div>
      <h1>The Home Page</h1>
      <EventList events={featuredEvents} />
    </div>
  )
}

export default HomePage
