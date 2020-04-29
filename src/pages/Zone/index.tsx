import React from 'react'
import { graphql } from 'babel-plugin-relay/macro'

import { QueryRenderer } from 'react-relay'
import environment from '../../relayEnvironment'
import ErrorBox from '../../components/ErrorBox'
import { RouteComponentProps } from 'react-router-dom'
import ZoneRoot from './ZoneRoot'
import { ZoneQuery } from '../../__generated__/ZoneQuery.graphql'
import { LinearProgress } from '@material-ui/core'

const Zone: React.FC<RouteComponentProps<{ code: string }>> = ({ match, history }) => {
  const code = match.params.code

  const onSearch = (code: string) => {
    history.push(`/zones/${code}`)
  }

  const gotoCompare = (code: string) => {
    history.push(`/compare?codes=${code}`)
  }

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
          return <ZoneRoot zoneStats={props.zoneStats} onSearch={onSearch} gotoCompare={gotoCompare} />
        }
        return <LinearProgress />
      }}
    />
  )
}

export default Zone
