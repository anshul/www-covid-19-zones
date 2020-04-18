import React from 'react'
import { graphql } from 'babel-plugin-relay/macro'

import { Row, Col } from 'react-flexbox-grid'
import { createFragmentContainer } from 'react-relay'
import { ZoneRoot_zoneStats } from '../../__generated__/ZoneRoot_zoneStats.graphql'
import CustomLineChart from '../../components/CustomLineChart'
import { makeStyles, createStyles } from '@material-ui/styles'
import Searchbar from '../../components/Searchbar'

interface Props {
  zoneStats: ZoneRoot_zoneStats
}

const useStyles = makeStyles(() =>
  createStyles({
    newCasesContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
  })
)

const ZoneRoot: React.FC<Props> = ({ zoneStats }) => {
  const classes = useStyles()

  return (
    <Row>
      <Col xs={12} xl={6} xlOffset={3}>
        <Searchbar />
      </Col>
      <Col xs={12} md={8} mdOffset={2} className={classes.newCasesContainer}>
        <CustomLineChart title='New Cases' height={350} chart={zoneStats.newCases} />
      </Col>
    </Row>
  )
}

export default createFragmentContainer(ZoneRoot, {
  zoneStats: graphql`
    fragment ZoneRoot_zoneStats on ZoneStats {
      zone {
        slug
      }
      newCases {
        ...CustomLineChart_chart
      }
    }
  `,
})
