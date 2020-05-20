import { Close } from '@material-ui/icons'
import { graphql } from 'babel-plugin-relay/macro'
import React, { useMemo, useState } from 'react'
import { Col, Grid, Row } from 'react-flexbox-grid'
import { createFragmentContainer } from 'react-relay'
import ChartOptionsRow from '../../components/ChartOptionsRow'
import CustomLineChart from '../../components/CustomLineChart'
import Searchbar from '../../components/Searchbar'
import { slateGrey } from '../../utils/ColorFactory'
import { filterData } from '../../utils/filterData'
import { CompareRoot_data } from '../../__generated__/CompareRoot_data.graphql'

interface Props {
  data: CompareRoot_data | null
  onCompare: (codes: string[]) => void
}
type DateRangeT = 'all' | '1m' | '1w'

const CompareRoot: React.FC<Props> = ({ data, onCompare }) => {
  const codes = data ? data.zones.map((zone) => [zone.code, zone.name] || []) || [] : []
  const [logScale, setLogScale] = useState(false)
  const [dateRange, setDateRange] = useState<DateRangeT>('all')
  const filteredData = useMemo(() => {
    if (!data) return []
    return filterData(dateRange, data.newCases.data)
  }, [data, dateRange])
  const cumFilteredData = useMemo(() => {
    if (!data) return []
    return filterData(dateRange, data.cumCases.data)
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
        <Col xs={12}>
          <Searchbar onSearch={(code) => onCompare(codes.map((code) => code[0]).concat([code]))} />
        </Col>
      </Row>
      <Row style={{ minHeight: '40px', padding: '8px 0' }}>
        <Col xs={12}>
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
                <Close
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
        {data.totalCases.map((cases) => (
          <Col key={cases.zoneName} xs={6} sm={2}>
            <small style={{ fontWeight: 500 }}>{cases.zoneName}</small>
            <h6>Total infections</h6>
            <h3>{cases.count}</h3>
            <h6>
              as of <span>{cases.asOf}</span>
            </h6>
          </Col>
        ))}
        <Col xs={12} sm={Math.max(2, 12 - data.totalCases.length * 2)}>
          <ChartOptionsRow dateRange={dateRange} setDateRange={setDateRange} logScale={logScale} setLogScale={setLogScale} />
        </Col>
      </Row>

      <Row>
        <Col xs={12} xl={12} xlOffset={0}>
          <CustomLineChart
            title={`Infections by day - 5 day average`}
            palette='normal'
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
            title={`Total infections (cumulative)`}
            palette='normal'
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
