import React, { useMemo } from 'react'
import { graphql } from 'babel-plugin-relay/macro'
import { makeStyles, createStyles } from '@material-ui/styles'
import { createFragmentContainer } from 'react-relay'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { DateRangeT, UrlT } from '../../types'

import ErrorPanel from './ErrorPanel'
import ZoneBar from './ZoneBar'
import CompareBar from './CompareBar'

interface Props {
  data: V2HomeRoot_data | null
  go: (target: UrlT) => void
  mode: string
  dateRange: DateRangeT
  logScale: boolean
}

const MODES = ['compare', 'zones']

const useStyles = makeStyles(() => createStyles({}))

const V2HomeRoot: React.FC<Props> = ({ data, mode, go, dateRange, logScale }) => {
  const classes = useStyles()
  const onSearch = (code: string) => go({ codes: mode === 'compare' ? [code] : [code] })

  const firstZone = data && data.zones.length >= 1 ? data.zones[0] : null
  if (!data) {
    console.log('loading...')
    return (
      <Grid>
        <Row>
          <Col>Loading...</Col>
        </Row>
      </Grid>
    )
  }

  if (!MODES.find((m) => m === mode)) return <ErrorPanel onSearch={onSearch} message='Page not found!' />
  if (!firstZone) return <ErrorPanel onSearch={onSearch} message='Invalid zone!' />

  return (
    <Grid>
      {mode === 'compare' ? <CompareBar zones={data.zones} go={go} /> : <ZoneBar zone={firstZone} go={go} />}
      <Row style={{ minHeight: '40px' }}>
        <Col xs={12}>
          <pre>{JSON.stringify({ mode, data })}</pre>
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
