import React from 'react'
import ZoneRoot from './ZoneRoot'
import { RouteComponentProps } from 'react-router-dom'

const Zone: React.FC<RouteComponentProps<{ slug: string }>> = ({ match }) => {
  const slug = match.params.slug

  console.log('Rendering Zone')

  return <ZoneRoot slug={slug} />
}

export default Zone
