import { graphql } from 'babel-plugin-relay/macro'
import * as d3 from 'd3'
import React, { useEffect, useMemo, useState } from 'react'
import { Col, Grid, Row } from 'react-flexbox-grid'
import { createFragmentContainer } from 'react-relay'
import useSWR from 'swr'
import { DateRangeT, MapDataT, UrlT } from '../../types'
import { lineColors } from '../../utils/ColorFactory'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'
import Choropleth from './Choropleth'
import CompareBar from './CompareBar'
import DailyChart from './DailyChart'
import ErrorPanel from './ErrorPanel'
import ZoneBar from './ZoneBar'
import ZoneCard from './ZoneCard'

interface Props {
  data: V2HomeRoot_data | null
  codes: string[]
  go: (target: UrlT) => void
  mode: string
  dateRange: DateRangeT
  logScale: boolean
}

const MODES = ['compare', 'zones']

const emptyZone = {
  code: '',
  name: '',
}

const colors = {
  palette: ['#fffcf9', '#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704', '#641A2C'],
  palette0: ['#fffcf9', '#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d', '#333333'],
  palette2: ['#fffcf9', '#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d', '#333333'],
}
const thresholds = [3, 5, 10, 20, 40, 60, 80, 100, 250, 1000]

const V2HomeRoot: React.FC<Props> = ({ data, codes, mode, go, dateRange, logScale }) => {
  const onSearch = (code: string) => go({ codes: mode === 'compare' ? [code] : [code] })
  const colorScale = useMemo(() => d3.scaleThreshold<number, string>().domain(thresholds).range(colors.palette), [])
  const colorConst = (count: number): string => '#eeeeee'

  const response: MapDataT = useSWR(`/api/maps?codes=in`)
  const colorMap = data
    ? Object.fromEntries(new Map(data.zones.map((zone, i) => [zone.code, lineColors[i] ? lineColors[i][500] : '#aaaaaa'])))
    : {}
  const [cachedData, setCachedData] = useState(data)
  const firstZone = cachedData && cachedData.zones.length >= 1 ? cachedData.zones[0] : null
  useEffect(() => {
    if (data) setCachedData(data)
  }, [data])
  if (cachedData) {
    if (!MODES.find((m) => m === mode)) return <ErrorPanel onSearch={onSearch} message='Page not found!' />
    if (!firstZone) return <ErrorPanel onSearch={onSearch} message='Invalid zone!' />
  }

  return (
    <Grid>
      {mode === 'compare' ? (
        <CompareBar zones={cachedData ? cachedData.zones : []} go={go} />
      ) : (
        <ZoneBar zone={firstZone || emptyZone} go={go} />
      )}
      <Row style={{ minHeight: '40px' }}>
        <Col xs={12} md={12}>
          <Row start='xs'>
            {cachedData &&
              cachedData.zones.map((zone) => (
                <Col className='fade' xs={6} sm={4} md={3} lg={2} key={zone.code}>
                  <ZoneCard lineColor={colorMap[zone.code]} ipmColor={colorScale} iColor={colorConst} zone={zone} />
                </Col>
              ))}
          </Row>

          <Choropleth
            colorMap={colorMap}
            map={response.data as MapDataT}
            codes={codes}
            mode={mode}
            data={cachedData}
            colorScale={colorScale}
            colorConst={colorConst}
            go={go}
            dateRange={dateRange}
            logScale={logScale}
          />
        </Col>
        <Col xs={12} md={12}>
          <DailyChart colorMap={colorMap} codes={codes} mode={mode} data={cachedData} go={go} dateRange={dateRange} logScale={logScale} />
        </Col>
      </Row>
    </Grid>
  )
}

export default createFragmentContainer(V2HomeRoot, {
  data: graphql`
    fragment V2HomeRoot_data on V2Stats {
      zones {
        code
        name
        ...ZoneCard_zone
        unitCodes
        chart {
          dt
          newInf
          newInfSma5
          totInf
        }
        parent {
          code
          name
        }
      }
    }
  `,
})
