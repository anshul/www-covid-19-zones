import React, { useState, useMemo } from 'react'
import { graphql } from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'
import { CompareRoot_data } from '../../__generated__/CompareRoot_data.graphql'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { Button } from '@material-ui/core'
import Searchbar from '../../components/Searchbar'
import { slateGrey } from '../../utils/ColorFactory'
import { IoIosClose } from 'react-icons/io'
import CustomLineChart from '../../components/CustomLineChart'

interface Props {
  data: CompareRoot_data | null
  onCompare: (codes: string[]) => void
}
type DateRangeT = 'all_time' | 'last_30_days' | 'last_7_days'

const CompareRoot: React.FC<Props> = ({ data, onCompare }) => {
  const codes = data ? data.zones.map((zone) => [zone.code, zone.name] || []) || [] : []
  const [logScale, setLogScale] = useState(false)
  const [dateRange, setDateRange] = useState<DateRangeT>('last_30_days')
  const dateRanges: { label: string; value: DateRangeT }[] = [
    { label: 'All Time', value: 'all_time' },
    { label: '1 Month', value: 'last_30_days' },
    { label: '7 Days', value: 'last_7_days' },
  ]
  const filteredData = useMemo(() => {
    if (!data) return []
    switch (dateRange) {
      case 'all_time':
        return data.newCases.data
      case 'last_30_days':
        return data.newCases.data.slice(data.newCases.data.length - 30)
      case 'last_7_days':
        return data.newCases.data.slice(data.newCases.data.length - 7)
    }
  }, [data, dateRange])
  const cumFilteredData = useMemo(() => {
    if (!data) return []
    switch (dateRange) {
      case 'all_time':
        return data.cumCases.data
      case 'last_30_days':
        return data.cumCases.data.slice(data.cumCases.data.length - 30)
      case 'last_7_days':
        return data.cumCases.data.slice(data.cumCases.data.length - 7)
    }
  }, [data, dateRange])

  if (!data) {
    return (
      <>
        <Row>
          <Col xs={12} xl={8} xlOffset={2}>
            <Searchbar onSearch={(code) => onCompare(codes.map((code) => code[0]).concat([code]))} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} xl={8} xlOffset={2} style={{ marginTop: '50px' }}>
            <h5>One or more zones is incorrect!</h5>
            <p>
              <small>Try another compare...</small>
            </p>
          </Col>
        </Row>
      </>
    )
  }

  return (
    <Grid>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}>
          <Searchbar onSearch={(code) => onCompare(codes.map((code) => code[0]).concat([code]))} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {codes.map((code) => (
              <div
                key={code[0]}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: slateGrey[100],
                  borderRadius: '24px',
                  padding: '4px 12px',
                  marginRight: '4px',
                }}
              >
                {code[1]}
                <IoIosClose
                  style={{ cursor: 'pointer', marginLeft: '8px', backgroundColor: slateGrey[200], borderRadius: '50%' }}
                  onClick={() => {
                    const currentCodeIdx = codes.indexOf(code)
                    onCompare(
                      codes
                        .slice(0, currentCodeIdx)
                        .concat(codes.slice(currentCodeIdx + 1))
                        .map((code) => code[0])
                    )
                  }}
                />
              </div>
            ))}
          </div>
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
        {data.totalCases.map((cases) => (
          <Col key={cases.zoneName} xs={12} xl={codes.length > 2 ? 4 : 6}>
            <p>
              Total Confirmed Cases (<b>{cases.zoneName}</b>)
            </p>
            <h4>{cases.count}</h4>
            <h6> as of {cases.asOf}</h6>
          </Col>
        ))}
      </Row>
      <Row>
        <Col xs={12} xl={12} xlOffset={0}>
          <CustomLineChart
            title='New cases'
            height={350}
            xAxisKey={data.newCases.xAxisKey}
            lineKeys={data.newCases.lineKeys}
            data={filteredData}
            logScale={logScale}
          />
        </Col>
        <Col xs={12} xl={12} xlOffset={2} style={{ marginTop: '15px' }}>
          <h6>Source: covid19india.org, mohfw.gov.in and various state governments</h6>
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={12} xlOffset={0}>
          <CustomLineChart
            title='Total cases (cumulative)'
            height={350}
            xAxisKey={data.cumCases.xAxisKey}
            lineKeys={data.cumCases.lineKeys}
            data={cumFilteredData}
            logScale={logScale}
          />
        </Col>
        <Col xs={12} xl={12} xlOffset={2} style={{ marginTop: '15px' }}>
          <h6>Source: covid19india.org, mohfw.gov.in and various state governments</h6>
        </Col>
      </Row>
    </Grid>
  )
}

export default createFragmentContainer(CompareRoot, {
  data: graphql`
    fragment CompareRoot_data on CompareStats {
      zones {
        code
        slug
        name
        parentZone {
          slug
          code
          name
        }
      }
      totalCases {
        zoneName
        count
        asOf
      }
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
