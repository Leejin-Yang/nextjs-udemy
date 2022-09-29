import { FormEventHandler, useRef } from 'react'
import Button from '../common/button'
import styles from './eventSearch.module.css'

const YEAR_OPTIONS = ['2021', '2022']
const MONTH_OPTIONS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
]

interface Props {
  onSearch: (year: string, month: string) => void
}

const EventSearch = ({ onSearch }: Props) => {
  const yearInputRef = useRef<HTMLSelectElement>(null)
  const monthInputRef = useRef<HTMLSelectElement>(null)

  const onFilterSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    const selectedYear = yearInputRef.current?.value
    const selectedMonth = monthInputRef.current?.value

    if (!selectedYear || !selectedMonth) return

    onSearch(selectedYear, selectedMonth)
  }

  return (
    <form className={styles.form} onSubmit={onFilterSubmit}>
      <div className={styles.controls}>
        <div className={styles.control}>
          <label htmlFor='year'>Year</label>
          <select id='year' ref={yearInputRef}>
            {YEAR_OPTIONS.map((year) => (
              <option key={`year-select-${year}`} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.control}>
          <label htmlFor='month'>Month</label>
          <select id='month' ref={monthInputRef}>
            {MONTH_OPTIONS.map((month) => (
              <option key={`month-select-${month}`} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button>Find Events</Button>
    </form>
  )
}

export default EventSearch
