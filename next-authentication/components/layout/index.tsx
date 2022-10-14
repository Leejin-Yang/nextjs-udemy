import { Fragment } from 'react'
import type { ReactNode } from 'react'

import MainNavigation from './navigation'

interface Props {
  children: ReactNode
}

function Layout({ children }: Props) {
  return (
    <Fragment>
      <MainNavigation />
      <main>{children}</main>
    </Fragment>
  )
}

export default Layout
