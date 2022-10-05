import { GetServerSideProps } from 'next'

import Button from '../../components/common/button'
import ErrorAlert from '../../components/common/errorAlert'
import EventList from '../../components/events/eventList'
import ResultsTitle from '../../components/events/resultsTitle'
import { Event, getFilteredEvents } from '../../services/events'

interface Props {
  events?: Event[]
  date?: { year: number; month: number }
  hasError?: true
}

const FilteredEventsPage = ({ events, date, hasError }: Props) => {
  if (hasError) {
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

  if (!events || events.length === 0 || !date) {
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

  const selectedDate = new Date(date.year, date.month - 1)

  return (
    <>
      <ResultsTitle date={selectedDate} />
      <EventList events={events} />
    </>
  )
}

export default FilteredEventsPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  const filterData = params?.slug as string[]

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
    return {
      props: { hasError: true },
      //notFound: true,
      //redirect: {
      //  destination: '/error',
      //},
    }
  }

  const filteredEvents = await getFilteredEvents({
    year: numberYear,
    month: numberMonth,
  })

  return {
    props: {
      events: filteredEvents,
      date: { year: numberYear, month: numberMonth },
    },
  }
}
