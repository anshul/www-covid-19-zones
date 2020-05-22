import React from 'react'
import { graphql } from 'babel-plugin-relay/macro'
import { SWRConfig } from 'swr'
import { serverUrl } from '../../api/server'

import { QueryRenderer } from 'react-relay'
import environment from '../../relayEnvironment'
import ErrorPage from '../../pages/ErrorPage'
import { RouteComponentProps } from 'react-router-dom'
import V2HomeRoot from './V2HomeRoot'
import { parse, stringify } from 'qs'
import { V2HomeQuery } from '../../__generated__/V2HomeQuery.graphql'
import { DateRangeT, UrlT } from '../../types'
import isTouchDevice from './isTouchDevice'
import './fade.css'

const V2Home: React.FC<RouteComponentProps<{ mode: string; codes: string }>> = ({ location, match, history }) => {
  const q = parse(location.search, { ignoreQueryPrefix: true })
  const codes = match.params.codes.split(',')
  const dateRange: string = ['all', '1w', '1m'].find((x) => x === q.t) || 'all'
  const isLogarithmic: boolean = `${q.log || ''}`.length > 1 && q.log !== 'no'
  const mode: string = match.params.mode || 'zones'

  const go = (target: UrlT) => {
    const newTarget = { mode, codes, dateRange: q.dateRange, isLogarithmic: q.isLogarithmic, ...target }
    newTarget.codes = newTarget.codes.filter((x) => x)

    const newQ = stringify({ t: newTarget.dateRange, log: `${newTarget.isLogarithmic || ''}`.length > 1 ? 'yes' : undefined })
    const query = newQ.length > 1 ? `?${newQ}` : ''

    if (newTarget.codes.length === 0) {
      history.push(`/v2`)
      return
    }
    history.push(`/v2/${newTarget.mode}/${newTarget.codes.join(',')}${query}`)
  }

  console.log('Rendering V2Home', { codes, mode, dateRange, isLogarithmic })

  return (
    <QueryRenderer<V2HomeQuery>
      environment={environment}
      fetchPolicy='store-and-network'
      query={graphql`
        query V2HomeQuery($codes: [String!]!) {
          v2Stats(codes: $codes) {
            ...V2HomeRoot_data
          }
        }
      `}
      variables={{ codes: codes }}
      render={({ error, props }) => {
        if (error) {
          return <ErrorPage error={error} />
        } else {
          return (
            <SWRConfig
              value={{
                fetcher: (url, ...args) => fetch(`${serverUrl}${url}`, ...args).then((res) => res.json()),
              }}
            >
              <V2HomeRoot
                isTouchDevice={isTouchDevice()}
                data={props ? props.v2Stats : null}
                codes={codes}
                mode={mode}
                go={go}
                dateRange={dateRange as DateRangeT}
                isLogarithmic={isLogarithmic}
              />
            </SWRConfig>
          )
        }
      }}
    />
  )
}

export default V2Home
