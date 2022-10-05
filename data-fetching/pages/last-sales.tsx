import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

// useSWR fetcher 활용
// const fetcher = (url: string) =>
//  fetch(url)
//    .then((res) => res.json())
//    .then((data) => {
//      const transformedSales = []

//      for (const key in data) {
//        transformedSales.push({
//          id: key,
//          userName: data[key].userName,
//          volume: data[key].volume,
//        })
//      }

//      return transformedSales
//    })

interface Sales {
  id: string
  userName: string
  volume: number
}

interface Props {
  sales: Sales[]
}

const LastSalesPage = ({ sales }: Props) => {
  const [currentSales, setCurrentSales] = useState<Sales[]>(sales)
  //  const [isLoading, setIsLoading] = useState(false)

  const { data, error } = useSWR(
    'https://nextjs-udemy-ed3f6-default-rtdb.firebaseio.com/sales.json'
  )

  // useEffect로 데이터 변형
  useEffect(() => {
    const transformedSales = []

    for (const key in data) {
      transformedSales.push({
        id: key,
        userName: data[key].userName,
        volume: data[key].volume,
      })
    }

    setCurrentSales(transformedSales)
  }, [data])

  if (error) {
    return <p>Failed to load.</p>
  }

  if (!data && !sales) {
    return <p>Loading...</p>
  }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.userName} - ${sale.volume}
        </li>
      ))}
    </ul>
  )
}

export default LastSalesPage

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch(
    'https://nextjs-udemy-ed3f6-default-rtdb.firebaseio.com/sales.json'
  )
  const data = await response.json()
  const transformedSales = []

  for (const key in data) {
    transformedSales.push({
      id: key,
      userName: data[key].userName,
      volume: data[key].volume,
    })
  }

  return {
    props: { sales: transformedSales },
  }
}

//export const getStaticProps: GetStaticProps = async () => {
//  return fetch(
//    'https://nextjs-udemy-ed3f6-default-rtdb.firebaseio.com/sales.json'
//  )
//    .then((res) => res.json())
//    .then((data) => {
//      // data는 객체의 형태로 오기에 배열로 transform 해준다.
//      // data === {s1: {}, s2: {}}
//      const transformedSales = []

//      for (const key in data) {
//        transformedSales.push({
//          id: key,
//          userName: data[key].userName,
//          volume: data[key].volume,
//        })
//      }

//      return {
//        props: { sales: transformedSales },
//      }
//    })
//}
