import { useEffect, useState } from 'react'

interface Sales {
  id: string
  userName: string
  volume: number
}

const LastSalesPage = () => {
  const [sales, setSales] = useState<Sales[]>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch('https://nextjs-udemy-ed3f6-default-rtdb.firebaseio.com/sales.json')
      .then((res) => res.json())
      .then((data) => {
        // data는 객체의 형태로 오기에 배열로 transform 해준다.
        // data === {s1: {}, s2: {}}
        const transformedSales = []

        for (const key in data) {
          transformedSales.push({
            id: key,
            userName: data[key].userName,
            volume: data[key].volume,
          })
        }

        setSales(transformedSales)
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <ul>
      {sales?.map((sale) => (
        <li key={sale.id}>
          {sale.userName} - ${sale.volume}
        </li>
      ))}
    </ul>
  )
}

export default LastSalesPage
