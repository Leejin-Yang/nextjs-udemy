export interface Event {
  id: string
  title: string
  description: string
  location: string
  date: string
  image: string
  isFeatured: boolean
}

export async function getAllEvents() {
  const response = await fetch(
    'https://nextjs-udemy-ed3f6-default-rtdb.firebaseio.com/events.json'
  )
  const data = await response.json()

  const events: Event[] = []

  for (const key in data) {
    events.push({
      id: key,
      ...data[key],
    })
  }

  return events
}

export async function getFeaturedEvents() {
  const allEvents = await getAllEvents()
  return allEvents.filter((event) => event.isFeatured)
}
