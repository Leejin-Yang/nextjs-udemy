import { GetStaticProps } from 'next'
import fs from 'fs'
import path from 'path'

import { Product } from '../types/product'
import Link from 'next/link'

interface Props {
  products: Product[]
}

const HomePage = ({ products }: Props) => {
  return (
    <ul>
      {products.map((product) => (
        <li key={`product-${product.id}`}>
          <Link href={`/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default HomePage

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), 'data', 'dummyBackend.json')
  const jsonData = fs.readFileSync(filePath, { encoding: 'utf-8' })
  const data = JSON.parse(jsonData) as { products: Product[] }

  if (data.products.length === 0) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      products: data.products,
    },
    revalidate: 600,
  }
}
