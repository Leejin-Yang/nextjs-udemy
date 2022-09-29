import { GetStaticProps } from 'next'

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
  return {
    props: {
      products: [{ id: 'p1', title: 'Product 1' }],
    },
  }
}
