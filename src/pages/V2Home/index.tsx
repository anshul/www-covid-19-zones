import React from 'react'
import { graphql } from 'babel-plugin-relay/macro'

import { QueryRenderer } from 'react-relay'
import environment from '../../relayEnvironment'
import ErrorBox from '../../components/ErrorBox'
import { RouteComponentProps } from 'react-router-dom'
import V2HomeRoot from './V2HomeRoot'
import { parse } from 'qs'
import { V2HomeQuery } from '../../__generated__/V2HomeQuery.graphql'
import { DateRangeT, ModeT } from '../../types'

const V2Home: React.FC<RouteComponentProps<{ codes: string }>> = ({ location, match, history }) => {
  const q = parse(location.search, { ignoreQueryPrefix: true })
  const codes = match.params.codes.split(',')
  const dateRange: string = ['all', '1w', '1m'].find((x) => x === q.t) || 'all'
  const logScale: boolean = `${q.log || ''}`.length > 1 && q.log !== 'no'
  const mode: ModeT = location.pathname.match(/compare/) ? 'compare' : 'zone'

  const viewZone = (code: string) => {
    codes.length > 0 ? history.push(`/v2/zones/${code}`) : history.push(`/v2`)
  }

  const compareZones = (codes: string[]) => {
    codes.length > 0 ? history.push(`/v2/compare/${codes.sort().join(',')}`) : history.push(`/v2`)
  }

  console.log('Rendering V2Home', codes)

  return (
    <QueryRenderer<V2HomeQuery>
      environment={environment}
      query={graphql`
        query V2HomeQuery($codes: [String!]!) {
          v2Stats(codes: $codes) {
            code
          }
        }
      `}
      variables={{ codes: codes }}
      render={({ error, props }) => {
        if (error) {
          return <ErrorBox error={error} />
        } else if (props) {
          return (
            <V2HomeRoot
              data={props.v2Stats}
              mode={mode}
              viewZone={viewZone}
              dateRange={dateRange as DateRangeT}
              logScale={logScale}
              compareZones={compareZones}
            />
          )
        }
        return 'Loading'
      }}
    />
  )
}

export default V2Home
