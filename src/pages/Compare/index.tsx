import React from 'react'
import { graphql } from 'babel-plugin-relay/macro'

import { QueryRenderer } from 'react-relay'
import environment from '../../relayEnvironment'
import ErrorBox from '../../components/ErrorBox'
import { RouteComponentProps } from 'react-router-dom'
import CompareRoot from './CompareRoot'
import { parse } from 'qs'
import { CompareQuery } from '../../__generated__/CompareQuery.graphql'

const Compare: React.FC<RouteComponentProps<{ codes: string }>> = ({ location, history }) => {
  const q = parse(location.search, { ignoreQueryPrefix: true })
  const codes = (q.codes as string).split(',')

  const onCompare = (codes: string[]) => {
    codes.length > 0 ? history.push(`/compare?codes=${codes}`) : history.push(`/`)
  }

  console.log('Rendering Compare', codes)

  return (
    <QueryRenderer<CompareQuery>
      environment={environment}
      query={graphql`
        query CompareQuery($codes: [String!]!) {
          compare(codes: $codes) {
            ...CompareRoot_data
          }
        }
      `}
      variables={{ codes: codes }}
      render={({ error, props }) => {
        if (error) {
          return <ErrorBox error={error} />
        } else if (props) {
          return <CompareRoot data={props.compare} onCompare={onCompare} />
        }
        return 'Loading'
      }}
    />
  )
}

export default Compare
