import React from 'react'
import { graphql } from 'babel-plugin-relay/macro'

import { QueryRenderer } from 'react-relay'
import environment from '../../relayEnvironment'
import ErrorBox from '../../components/ErrorBox'
import { RouteComponentProps } from 'react-router-dom'
import ZoneRoot from './ZoneRoot'
import { ZoneQuery } from '../../__generated__/ZoneQuery.graphql'

const Zone: React.FC<RouteComponentProps<{ code: string }>> = ({ match }) => {
  const code = match.params.code

  console.log('Rendering Zone', code)

  return (
    <QueryRenderer<ZoneQuery>
      environment={environment}
      query={graphql`
        query ZoneQuery($code: String!) {
          zoneStats(code: $code) {
            ...ZoneRoot_zoneStats
          }
        }
      `}
      variables={{ code: code }}
      render={({ error, props }) => {
        if (error) {
          return <ErrorBox error={error} />
        } else if (props) {
          return <ZoneRoot zoneStats={props.zoneStats} />
        }
        return 'Loading'
      }}
    />
  )
}

export default Zone
