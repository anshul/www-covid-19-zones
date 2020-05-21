import { Breadcrumbs, Button } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { createStyles, makeStyles } from '@material-ui/core'
import { graphql } from 'babel-plugin-relay/macro'
import React, { useMemo, useState } from 'react'
import { Col, Grid, Row } from 'react-flexbox-grid'
import { createFragmentContainer } from 'react-relay'
import { Link } from 'react-router-dom'
import ChartOptionsRow from '../../components/ChartOptionsRow'
import CustomLineChart from '../../components/CustomLineChart'
import Searchbar from '../../components/Searchbar'
import { slateGrey } from '../../utils/ColorFactory'
import { DateRangeT, filterData } from '../../utils/filterData'
import { ZoneRoot_zoneStats } from '../../__generated__/ZoneRoot_zoneStats.graphql'

interface Props {
  zoneStats: ZoneRoot_zoneStats | null
  onSearch: (code: string) => void
  gotoCompare: (code: string) => void
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

const ZoneRoot: React.FC<Props> = ({ zoneStats, onSearch, gotoCompare }) => {
  const classes = useStyles()
  const [dateRange, setDateRange] = useState<DateRangeT>('all')

  const [logScale, setLogScale] = useState(false)
  const filteredData = useMemo(() => {
    if (!zoneStats) return []
    return filterData(dateRange, zoneStats.newCases.data as object[])
  }, [zoneStats, dateRange])

  const cumFilteredData = useMemo(() => {
    if (!zoneStats) return []
    return filterData(dateRange, zoneStats.cumCases.data as object[])
  }, [zoneStats, dateRange])

  if (!zoneStats) {
    return (
      <Grid>
        <Row>
          <Col xs={12} xl={8} xlOffset={2}>
            <Searchbar onSearch={onSearch} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} xl={8} xlOffset={2} style={{ marginTop: '50px' }}>
            <h5>No such zone!</h5>
            <p>
              <small>Try another search ...</small>
            </p>
          </Col>
        </Row>
      </Grid>
    )
  }

  return (
    <Grid>
      <Row>
        <Col xs={12}>
          <Searchbar onSearch={onSearch} />
        </Col>
      </Row>
      <Row style={{ minHeight: '40px' }}>
        <Col>
          <Breadcrumbs style={{ marginLeft: '10px' }}>
            {zoneStats.zone.parentZone && (
              <Link className={classes.parentZoneLinkText} color='inherit' to={`/zones/${zoneStats.zone.parentZone.code}`}>
                {zoneStats.zone.parentZone.name}
              </Link>
            )}
            <p className={classes.zoneLinkText}>{zoneStats.zone.name}</p>
          </Breadcrumbs>
        </Col>
        <Col xs>
          <Button
            style={{ marginLeft: '25px' }}
            size='small'
            disableElevation
            variant='contained'
            color='secondary'
            startIcon={<Add />}
            onClick={() => gotoCompare(zoneStats.zone.code)}
          >
            Compare
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={7} sm={4}>
          <h6>Total infections</h6>
          <h3>{zoneStats.totalCases}</h3>
          <h6>
            as of <span>{zoneStats.asOf}</span>
          </h6>
        </Col>
        <Col xs={12} sm={8}>
          <ChartOptionsRow dateRange={dateRange} setDateRange={setDateRange} logScale={logScale} setLogScale={setLogScale} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}></Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col xs={12} className={classes.newCasesContainer}>
          <CustomLineChart
            title={`Infections by day - ${zoneStats.zone.name}`}
            palette='paired'
            height={350}
            xAxisKey={zoneStats.newCases.xAxisKey}
            lineKeys={zoneStats.newCases.lineKeys}
            data={filteredData}
            logScale={logScale}
          />
        </Col>
        <Col xs={12} style={{ marginTop: '15px' }}>
          <h6>Sources: covid19india.org, mohfw.gov.in and various state governments</h6>
        </Col>
      </Row>
      <Row style={{ marginTop: '50px' }}>
        <Col xs={12} className={classes.newCasesContainer}>
          <CustomLineChart
            title={`Total infections - ${zoneStats.zone.name}`}
            palette='normal'
            height={350}
            xAxisKey={zoneStats.cumCases.xAxisKey}
            lineKeys={zoneStats.cumCases.lineKeys}
            data={cumFilteredData}
            logScale={logScale}
          />
        </Col>
        <Col xs={12} style={{ marginTop: '15px' }}>
          <h6>Sources: covid19india.org, mohfw.gov.in and various state governments</h6>
        </Col>
      </Row>
    </Grid>
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
      totalCases
      asOf
      cumCases {
        data
        lineKeys
        xAxisKey
      }
      newCases {
        data
        lineKeys
        xAxisKey
      }
    }
  `,
})
