import { useRouter } from 'next/router'
import Button from '../../components/common/button'
import ErrorAlert from '../../components/common/errorAlert'
import EventList from '../../components/events/eventList'
import ResultsTitle from '../../components/events/resultsTitle'
import { getFilteredEvents } from '../../data/dummy-data'

const FilteredEventsPage = () => {
  const router = useRouter()
  const filterData = router.query.slug

  if (!filterData) {
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
    !isValidMonth
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

  const filteredEvents = getFilteredEvents({
    year: numberYear,
    month: numberMonth,
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

  const date = new Date(numberYear, numberMonth - 1)

  return (
    <>
      <ResultsTitle date={date} />
      <EventList events={filteredEvents} />
    </>
  )
}

export default FilteredEventsPage
