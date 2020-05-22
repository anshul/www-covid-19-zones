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
import ChoroLegend from './ChoroLegend'
import CompareBar from './CompareBar'
import DailyChart from './DailyChart'
import ErrorPanel from './ErrorPanel'
import ZoneBar from './ZoneBar'
import ZoneCard from './ZoneCard'

interface Props {
  isTouchDevice: boolean
  data: V2HomeRoot_data | null
  codes: string[]
  go: (target: UrlT) => void
  mode: string
  dateRange: DateRangeT
  isLogarithmic: boolean
}

const MODES = ['compare', 'zones']

const emptyZone = {
  code: '',
  name: '',
}

const colors = {
  palette: ['#fff7ec', '#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026', '#662506', '#333333'],
}
// const ipmThresholds = [3, 5, 10, 20, 40, 60, 80, 100, 250, 1000]
const ipmThresholds = [3, 10, 20, 50, 75, 100, 250, 500, 1000, 2000, 10000]
const iThresholds = [0]

const V2HomeRoot: React.FC<Props> = ({ data, isTouchDevice, codes, mode, go, dateRange, isLogarithmic }) => {
  const aspectRatio = window.innerWidth / window.innerHeight
  const onSearch = (code: string) => go({ codes: mode === 'compare' ? [code] : [code] })
  const response: MapDataT = useSWR(`/api/maps?codes=in`)
  const [cachedData, setCachedData] = useState(data)
  const ipmColor = useMemo(() => d3.scaleThreshold<number, string>().domain(ipmThresholds).range(colors.palette), [])
  const iColor = useMemo(() => d3.scaleThreshold<number, string>().domain(iThresholds).range(['#ffffff', '#eeeeee']), [])
  const zoneColor = useMemo(
    () =>
      d3
        .scaleOrdinal<string, string>()
        .domain(cachedData ? cachedData.zones.map((z) => z.code) : [])
        .range(lineColors.map((l) => l[500])),
    [cachedData]
  )
  const mapHeight = useMemo(() => {
    if (cachedData && cachedData.zones.length === 1) {
      if (aspectRatio < 1) {
        return '400px'
      }
      return window.innerHeight - 400 > 300 ? `${window.innerHeight - 400}px` : '400px'
    }
    return cachedData && cachedData.zones.length > 1 ? '400px' : '200px'
  }, [aspectRatio, cachedData])
  const firstZone = cachedData && cachedData.zones.length >= 1 ? cachedData.zones[0] : null
  useEffect(() => {
    if (data) setCachedData(data)
  }, [data])
  if (cachedData) {
    if (!MODES.find((m) => m === mode)) return <ErrorPanel onSearch={onSearch} message='Page not found!' />
    if (!firstZone) return <ErrorPanel onSearch={onSearch} message='Invalid zone!' />
  }
  const groupZone = (z: V2HomeRoot_data['zones'][0]) =>
    z.category === 'country' || z.category === 'state'
      ? { ...z, key: z.code }
      : { ...(z.parent || z), key: `${(z.parent || z).code}-${z.category}`, name: `${(z.parent || z).name} (${z.pCategory})` }
  const parentZones = cachedData ? Object.values(Object.fromEntries(cachedData.zones.map(groupZone).map((z) => [z.key, z]))) : []
  const colWidth = cachedData ? Math.max(3, Math.floor(12 / parentZones.length)) : 12

  return (
    <Grid>
      {mode === 'compare' ? (
        <CompareBar zones={cachedData ? cachedData.zones : []} go={go} />
      ) : (
        <ZoneBar zone={firstZone || emptyZone} go={go} />
      )}
      <Row start='xs'>
        {cachedData &&
          cachedData.zones.map((zone) => (
            <Col className='fade' xs={6} sm={4} md={3} lg={2} key={zone.code}>
              <ZoneCard lineColor={zoneColor(zone.code)} ipmColor={ipmColor} iColor={iColor} zone={zone} />
            </Col>
          ))}
      </Row>
      <Col xs={12} md={12}>
        <ChoroLegend color={ipmColor} />
      </Col>

      <Row></Row>
      <Row style={{ minHeight: '40px' }}>
        {parentZones.map((group, index) => (
          <Col key={`map-${index}`} xs={Math.max(colWidth, 6)} md={Math.max(colWidth, 4)} lg={colWidth} style={{ height: mapHeight }}>
            <Choropleth
              title={group.name}
              titleCode={group.code}
              isTouchDevice={isTouchDevice}
              map={response.data as MapDataT}
              codes={codes}
              mode={mode}
              zones={cachedData ? cachedData.zones.filter((z) => groupZone(z).key === group.key) : null}
              zoneColor={zoneColor}
              ipmColor={ipmColor}
              iColor={iColor}
              go={go}
              dateRange={dateRange}
              isLogarithmic={isLogarithmic}
            />
          </Col>
        ))}
        <Col xs={12} md={12}>
          <DailyChart
            zoneColor={zoneColor}
            codes={codes}
            mode={mode}
            data={cachedData}
            go={go}
            dateRange={dateRange}
            isLogarithmic={isLogarithmic}
          />
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
        category
        pCategory
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
