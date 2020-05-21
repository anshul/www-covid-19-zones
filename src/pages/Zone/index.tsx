import React, { Suspense } from 'react'
import { RouteComponentProps } from 'react-router-dom'
const Zone = React.lazy(() => import('./Zone'))

const LazyZone: React.FC<RouteComponentProps<{ code: string }>> = (props) => {
  console.log('Lazy loading Zone')

  return (
    <Suspense fallback={<>Loading...</>}>
      <Zone {...props} />
    </Suspense>
  )
}

export default LazyZone
