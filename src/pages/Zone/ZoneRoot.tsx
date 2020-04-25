import React, { useState, useMemo } from 'react'
import { graphql } from 'babel-plugin-relay/macro'

import { Row, Col } from 'react-flexbox-grid'
import { createFragmentContainer } from 'react-relay'
import { ZoneRoot_zoneStats } from '../../__generated__/ZoneRoot_zoneStats.graphql'
import CustomLineChart from '../../components/CustomLineChart'
import { makeStyles, createStyles } from '@material-ui/styles'
import Searchbar from '../../components/Searchbar'
import { slateGrey } from '../../utils/ColorFactory'
import { Breadcrumbs, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { IoIosAdd } from 'react-icons/io'

interface Props {
  zoneStats: ZoneRoot_zoneStats
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

type DateRangeT = 'all_time' | 'last_30_days' | 'last_7_days'

const ZoneRoot: React.FC<Props> = ({ zoneStats, onSearch, gotoCompare }) => {
  const classes = useStyles()
  const [dateRange, setDateRange] = useState<DateRangeT>('all_time')
  const dateRanges: { label: string; value: DateRangeT }[] = [
    { label: 'All Time', value: 'all_time' },
    { label: '1 Month', value: 'last_30_days' },
    { label: '7 Days', value: 'last_7_days' },
  ]

  const [logScale, setLogScale] = useState(false)
  const filteredDate = useMemo(() => {
    switch (dateRange) {
      case 'all_time':
        return zoneStats.newCases.data
      case 'last_30_days':
        return zoneStats.newCases.data.slice(zoneStats.newCases.data.length - 30)
      case 'last_7_days':
        return zoneStats.newCases.data.slice(zoneStats.newCases.data.length - 7)
    }
  }, [zoneStats.newCases.data, dateRange])

  return (
    <>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}>
          <Searchbar onSearch={onSearch} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}>
          <Breadcrumbs>
            {zoneStats.zone.parentZone && (
              <Link className={classes.parentZoneLinkText} color='inherit' to={`/zones/${zoneStats.zone.parentZone.code}`}>
                {zoneStats.zone.parentZone.name}
              </Link>
            )}
            <p className={classes.zoneLinkText}>{zoneStats.zone.name}</p>
          </Breadcrumbs>
        </Col>
      </Row>
      <Row>
        <Col xs={10} xl={6} xlOffset={2}>
          <h6>Total Confirmed Cases</h6>
          <h3>{zoneStats.totalCases}</h3>
          <h6>
            as of <span style={{ backgroundColor: '#fdfd96' }}>{zoneStats.asOf}</span>
          </h6>
        </Col>
        <Col xs={2}>
          <Button
            disableElevation
            color='primary'
            variant='contained'
            startIcon={<IoIosAdd />}
            onClick={() => gotoCompare(zoneStats.zone.code)}
          >
            Compare
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}>
          <Row>
            <Col xs={12} xl={6} style={{ margin: '8px 0' }}>
              {dateRanges.map((range) => (
                <Button
                  disableElevation
                  key={range.value}
                  variant={range.value === dateRange ? 'contained' : 'text'}
                  color={range.value === dateRange ? 'primary' : 'default'}
                  onClick={() => setDateRange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </Col>
            <Col xs={12} xl={6} style={{ margin: '8px 0' }}>
              <Button
                disableElevation
                variant={!logScale ? 'contained' : 'text'}
                color={!logScale ? 'secondary' : 'default'}
                onClick={() => setLogScale(false)}
              >
                Linear Scale
              </Button>
              <Button
                disableElevation
                variant={logScale ? 'contained' : 'text'}
                color={logScale ? 'secondary' : 'default'}
                onClick={() => setLogScale(true)}
              >
                Log Scale
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={8} xlOffset={2} className={classes.newCasesContainer}>
          <CustomLineChart
            title='New Cases'
            height={350}
            xAxisKey={zoneStats.newCases.xAxisKey}
            lineKeys={zoneStats.newCases.lineKeys}
            data={filteredDate}
            logScale={logScale}
          />
        </Col>
        <Col xs={12} xl={8} xlOffset={4} style={{ marginTop: '15px' }}>
          <h6>Source: covid19india.org, mohfw.gov.in and various state governments</h6>
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
      totalCases
      asOf
      newCases {
        data
        lineKeys
        xAxisKey
      }
    }
  `,
})
