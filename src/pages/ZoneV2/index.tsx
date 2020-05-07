import React from 'react'
import { graphql } from 'babel-plugin-relay/macro'

import { QueryRenderer } from 'react-relay'
import environment from '../../relayEnvironment'
import ErrorBox from '../../components/ErrorBox'
import { RouteComponentProps } from 'react-router-dom'
import ZoneV2Root from './ZoneV2Root'
import { parse } from 'qs'
import { ZoneV2Query } from '../../__generated__/ZoneV2Query.graphql'

const ZoneV2: React.FC<RouteComponentProps<{ codes: string }>> = ({ location, match, history }) => {
  const q = parse(location.search, { ignoreQueryPrefix: true })
  const codes = match.params.codes.split(',')

  const viewZone = (code: string) => {
    codes.length > 0 ? history.push(`/v2/zones/${code}`) : history.push(`/v2`)
  }

  const compareZones = (codes: string[]) => {
    codes.length > 0 ? history.push(`/v2/compare/${codes.sort().join(',')}`) : history.push(`/v2`)
  }

  console.log('Rendering ZoneV2', codes)

  return (
    <QueryRenderer<ZoneV2Query>
      environment={environment}
      query={graphql`
        query ZoneV2Query($codes: [String!]!) {
          compare(codes: $codes) {
            ...ZoneV2Root_data
          }
        }
      `}
      variables={{ codes: codes }}
      render={({ error, props }) => {
        if (error) {
          return <ErrorBox error={error} />
        } else if (props) {
          return <ZoneV2Root data={props.compare} viewZone={viewZone} compareZones={compareZones} />
        }
        return 'Loading'
      }}
    />
  )
}

export default ZoneV2
