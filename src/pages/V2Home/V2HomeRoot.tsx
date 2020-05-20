import { graphql } from 'babel-plugin-relay/macro'
import React, { useState, useEffect } from 'react'
import { Col, Grid, Row } from 'react-flexbox-grid'
import { createFragmentContainer } from 'react-relay'
import { DateRangeT, UrlT, MapDataT } from '../../types'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'
import useSWR from 'swr'
import { lineColors } from '../../utils/ColorFactory'
import Choropleth from './Choropleth'
import CompareBar from './CompareBar'
import ErrorPanel from './ErrorPanel'
import ZoneBar from './ZoneBar'

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

const V2HomeRoot: React.FC<Props> = ({ data, codes, mode, go, dateRange, logScale }) => {
  const onSearch = (code: string) => go({ codes: mode === 'compare' ? [code] : [code] })
  const response: MapDataT = useSWR(`/api/maps?codes=in`)
  const colorMap = data ? Object.fromEntries(new Map(data.zones.map((zone, i) => [zone.code, lineColors[i][500]]))) : {}
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
          <Choropleth
            colorMap={colorMap}
            map={response.data as MapDataT}
            mode={mode}
            data={cachedData}
            go={go}
            dateRange={dateRange}
            logScale={logScale}
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
