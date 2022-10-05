import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import Button from '../../components/common/button'
import ErrorAlert from '../../components/common/errorAlert'
import EventList from '../../components/events/eventList'
import ResultsTitle from '../../components/events/resultsTitle'
import type { Event } from '../../services/events'

const FilteredEventsPage = () => {
  const [loadedEvents, setLoadedEvents] = useState<Event[]>()
  const [isError, setIsError] = useState(false)

  const router = useRouter()
  const filterData = router.query.slug as string[]

  const { data, error } = useSWR(
    'https://nextjs-udemy-ed3f6-default-rtdb.firebaseio.com/events.json'
  )

  useEffect(() => {
    if (!data) return

    const events: Event[] = []

    for (const key in data) {
      events.push({
        id: key,
        ...data[key],
      })
    }

    setLoadedEvents(events)
  }, [data])

  //useEffect(() => {
  //  const fetchData = async () => {
  //    try {
  //      const response = await fetch(
  //        'https://nextjs-udemy-ed3f6-default-rtdb.firebaseio.com/events.json'
  //      )
  //      const data = await response.json()

  //      const events: Event[] = []

  //      for (const key in data) {
  //        events.push({
  //          id: key,
  //          ...data[key],
  //        })
  //      }

  //      setLoadedEvents(events)
  //    } catch {
  //      setIsError(true)
  //    }
  //  }
  //  fetchData()
  //}, [])

  if (!loadedEvents) {
    return <p className='center'>Loading...</p>
  }

  const filteredYear = filterData[0]
  const filteredMonth = filterData[1]

  const numberYear = Number(filteredYear)
  const numberMonth = Number(filteredMonth)

  const isValidYear = numberYear >= 2021 && numberYear <= 2030
  const isValidMonth = numberMonth >= 1 && numberMonth <= 12

  if (
    isNaN(numberYear) ||
    isNaN(numberMonth) ||
    !isValidYear ||
    !isValidMonth ||
    isError
  ) {
    return (
      <>
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events'>Show All Events</Button>
        </div>
      </>
    )
  }

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getFullYear() === numberYear &&
      eventDate.getMonth() === numberMonth - 1
    )
  })

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <>
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events'>Show All Events</Button>
        </div>
      </>
    )
  }

  const selectedDate = new Date(numberYear, numberMonth - 1)

  return (
    <>
      <ResultsTitle date={selectedDate} />
      <EventList events={filteredEvents} />
    </>
  )
}

export default FilteredEventsPage
