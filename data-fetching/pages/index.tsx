import { GetStaticProps } from 'next'
import fs from 'fs'
import path from 'path'

interface Product {
  id: string
  title: string
}

interface Props {
  products: Product[]
}

const HomePage = ({ products }: Props) => {
  return (
    <ul>
      {products.map((product) => (
        <li key={`product-${product.id}`}>{product.title}</li>
      ))}
    </ul>
  )
}

export default HomePage

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), 'data', 'dummyBackend.json')
  const jsonData = fs.readFileSync(filePath, { encoding: 'utf-8' })
  const data = JSON.parse(jsonData) as { products: Product[] }

  return {
    props: {
      products: data.products,
    },
    revalidate: 600,
  }
}
