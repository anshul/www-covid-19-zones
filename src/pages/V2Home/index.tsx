import React, { Suspense } from 'react'
import { RouteComponentProps } from 'react-router-dom'
const V2Home = React.lazy(() => import('./V2Home'))

const LazyV2Home: React.FC<RouteComponentProps<{ mode: string; codes: string }>> = (props) => {
  console.log('Lazy loading V2Home')

  return (
    <Suspense fallback={<>Loading...</>}>
      <V2Home {...props} />
    </Suspense>
  )
}

export default LazyV2Home
