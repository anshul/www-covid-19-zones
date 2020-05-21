import React, { Suspense } from 'react'
import { RouteComponentProps } from 'react-router-dom'
const Compare = React.lazy(() => import('./Compare'))

const LazyCompare: React.FC<RouteComponentProps<{ codes: string }>> = (props) => {
  console.log('Lazy loading Compare')

  return (
    <Suspense fallback={<>Loading...</>}>
      <Compare {...props} />
    </Suspense>
  )
}

export default LazyCompare
