import React from 'react'
import { graphql } from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import { Row, Grid, Col } from 'react-flexbox-grid'
import Searchbar from '../../components/Searchbar'
import { HomeRoot_home } from '../../__generated__/HomeRoot_home.graphql'

interface Props {
  home: HomeRoot_home
}

const HomeRoot: React.FC<Props> = ({ home }) => {
  return (
    <Grid>
      <Row>
        <Col xs={12} xl={6} xlOffset={3}>
          <Searchbar />
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={6}></Col>
        <Col xs={12} xl={6}></Col>
        <Col xs={12} xl={6}></Col>
        <Col xs={12} xl={6}></Col>
      </Row>
      <Row style={{ margin: '8px 0' }}>
        <Col xs={12} xl={4}>
          <div>
            <h3 style={{ marginBottom: '8px' }}>Cases</h3>
            <h4 style={{ marginBottom: 'px' }}>India</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {home.cases.edges?.map(
                (edge) =>
                  edge &&
                  edge.node && (
                    <div key={edge.node.name}>
                      <h6>{edge.node.label}</h6>
                      <h3 style={{ margin: 0 }}>{edge.node.value}</h3>
                    </div>
                  )
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Grid>
  )
}

export default createFragmentContainer(HomeRoot, {
  home: graphql`
    fragment HomeRoot_home on HomeData {
      cases {
        edges {
          node {
            label
            name
            value
          }
        }
      }
    }
  `,
})
