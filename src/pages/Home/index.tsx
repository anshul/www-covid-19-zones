import React from 'react'

import { graphql } from 'babel-plugin-relay/macro'
import { QueryRenderer } from 'react-relay'
import environment from '../../relayEnvironment'
import ErrorBox from '../../components/ErrorBox'
import HomeRoot from './HomeRoot'
import { HomeQuery } from '../../__generated__/HomeQuery.graphql'
import { LinearProgress } from '@material-ui/core'

const Home: React.FC = () => {
  return (
    <QueryRenderer<HomeQuery>
      environment={environment}
      query={graphql`
        query HomeQuery {
          home {
            ...HomeRoot_home
          }
        }
      `}
      variables={{}}
      render={({ error, props }) => {
        if (error) {
          return <ErrorBox error={error} />
        } else if (props) {
          return <HomeRoot home={props.home} />
        }
        return <LinearProgress />
      }}
    />
  )
}

export default Home
