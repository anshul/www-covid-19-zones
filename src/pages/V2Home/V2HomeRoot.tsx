import React from 'react'
import { graphql } from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { DateRangeT, UrlT } from '../../types'
import useSWR from 'swr'

import ErrorPanel from './ErrorPanel'
import ZoneBar from './ZoneBar'
import CompareBar from './CompareBar'
import Choropleth, { ChoroplethResponse } from './Choropleth'
import Chart from './Chart'

interface Props {
  data: V2HomeRoot_data | null
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

const V2HomeRoot: React.FC<Props> = ({ data, mode, go, dateRange, logScale }) => {
  const onSearch = (code: string) => go({ codes: mode === 'compare' ? [code] : [code] })
  const firstZone = data && data.zones.length >= 1 ? data.zones[0] : null
  const codes = data && data.zones.length >= 1 ? data.zones.map((z) => z.code) : ['in']
  const response: ChoroplethResponse = useSWR(`/api/maps?codes=${codes.join(',')}`)
  if (data) {
    if (!MODES.find((m) => m === mode)) return <ErrorPanel onSearch={onSearch} message='Page not found!' />
    if (!firstZone) return <ErrorPanel onSearch={onSearch} message='Invalid zone!' />
  }

  return (
    <Grid>
      {mode === 'compare' ? <CompareBar zones={data ? data.zones : []} go={go} /> : <ZoneBar zone={firstZone || emptyZone} go={go} />}
      <Row style={{ minHeight: '40px' }}>
        <Col xs={12} md={6}>
          <Chart mode={mode} data={data} go={go} dateRange={dateRange} logScale={logScale} />
        </Col>

        <Col xs={12} md={6}>
          {/*<Choropleth data={response.data} error={response.error} /> */}
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
        parent {
          code
          name
        }
      }
    }
  `,
})
