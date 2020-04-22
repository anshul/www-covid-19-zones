import React from 'react'
import { graphql } from 'babel-plugin-relay/macro'

import { Row, Col } from 'react-flexbox-grid'
import { createFragmentContainer } from 'react-relay'
import { ZoneRoot_zoneStats } from '../../__generated__/ZoneRoot_zoneStats.graphql'
import CustomLineChart from '../../components/CustomLineChart'
import { makeStyles, createStyles } from '@material-ui/styles'
import Searchbar from '../../components/Searchbar'
import { slateGrey } from '../../utils/ColorFactory'
import { Breadcrumbs } from '@material-ui/core'
import { Link } from 'react-router-dom'

interface Props {
  zoneStats: ZoneRoot_zoneStats
}

const useStyles = makeStyles(() =>
  createStyles({
    newCasesContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    parentZoneLinkText: {
      color: slateGrey[500],
      textDecoration: 'none',
      fontWeight: 500,
    },
    zoneLinkText: {
      color: slateGrey[700],
      textDecoration: 'none',
      fontWeight: 700,
    },
  })
)

const ZoneRoot: React.FC<Props> = ({ zoneStats }) => {
  const classes = useStyles()

  return (
    <>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}>
          <Searchbar />
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}>
          <Breadcrumbs>
            {zoneStats.zone.parentZone && (
              <Link className={classes.parentZoneLinkText} color='inherit' to={`/zone/${zoneStats.zone.parentZone.code}`}>
                {zoneStats.zone.parentZone.name}
              </Link>
            )}
            <p className={classes.zoneLinkText}>{zoneStats.zone.name}</p>
          </Breadcrumbs>
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={8} xlOffset={2} className={classes.newCasesContainer}>
          <CustomLineChart title='New Cases' height={350} chart={zoneStats.newCases} />
        </Col>
      </Row>
    </>
  )
}

export default createFragmentContainer(ZoneRoot, {
  zoneStats: graphql`
    fragment ZoneRoot_zoneStats on ZoneStats {
      zone {
        code
        slug
        name
        parentZone {
          slug
          code
          name
        }
      }
      newCases {
        data
        lineKeys
        ...CustomLineChart_chart
      }
    }
  `,
})
