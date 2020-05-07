import React, { useMemo } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'
import Searchbar from '../../components/Searchbar'
import { DateRangeT, ModeT } from '../../types'

interface ZoneCache {
  code: string
}

interface Props {
  data: readonly ZoneCache[] | null
  compareZones: (codes: string[]) => void
  viewZone: (code: string) => void
  mode: ModeT
  dateRange: DateRangeT
  logScale: boolean
}

const V2HomeRoot: React.FC<Props> = ({ data, mode, compareZones, dateRange, logScale }) => {
  if (!data) {
    return (
      <>
        <Row>
          <Col xs={12} xl={8} xlOffset={2}>
            <Searchbar onSearch={(code) => {}} />
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
          <Searchbar onSearch={(code) => {}} />
        </Col>
      </Row>
      <Row style={{ minHeight: '40px' }}>
        <Col xs={12}>
          <pre>{JSON.stringify(data)}</pre>
        </Col>
      </Row>
    </Grid>
  )
}

export default V2HomeRoot
