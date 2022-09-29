import { GetStaticPaths, GetStaticProps } from 'next'
import fs from 'fs'
import path from 'path'

import { Product } from '../types/product'

interface Props {
  product: Product
}

const ProductDetailPage = ({ product }: Props) => {
  //  if (!product) {
  //    return <p>Loading...</p>
  //  }

  const { title, description } = product

  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
    </>
  )
}

export default ProductDetailPage

export const getStaticProps: GetStaticProps = (context) => {
  const { params } = context
  const productId = params?.pid

  const filePath = path.join(process.cwd(), 'data', 'dummyBackend.json')
  const jsonData = fs.readFileSync(filePath, { encoding: 'utf-8' })
  const data = JSON.parse(jsonData) as { products: Product[] }
  const product = data.products.find((product) => product.id === productId)

  return {
    props: { product },
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { pid: 'p1' } }],
    fallback: 'blocking',
  }
}
