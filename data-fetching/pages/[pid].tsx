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

const getData = () => {
  const filePath = path.join(process.cwd(), 'data', 'dummyBackend.json')
  const jsonData = fs.readFileSync(filePath, { encoding: 'utf-8' })
  const data = JSON.parse(jsonData) as { products: Product[] }

  return data
}

export default ProductDetailPage

export const getStaticProps: GetStaticProps = (context) => {
  const { params } = context
  const productId = params?.pid

  const data = getData()
  const product = data.products.find((product) => product.id === productId)

  if (!product) {
    return {
      notFound: true,
    }
  }

  return {
    props: { product },
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  const data = getData()
  const ids = data.products.map((product) => product.id)
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }))

  return {
    paths: pathsWithParams,
    fallback: false,
  }
}
