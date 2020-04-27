import React from 'react'

import { Row, Col } from 'react-flexbox-grid'
import { Button, ButtonGroup } from '@material-ui/core'

type DateRangeT = 'all_time' | 'last_30_days' | 'last_7_days'
interface Props {
  dateRange: DateRangeT
  setDateRange: (dateRange: DateRangeT) => void
  logScale: boolean
  setLogScale: (logScale: boolean) => void
}

const ChartOptionRow: React.FC<Props> = ({ dateRange, setDateRange, logScale, setLogScale }) => {
  const dateRanges: { label: string; value: DateRangeT }[] = [
    { label: 'All', value: 'all_time' },
    { label: '1 Month', value: 'last_30_days' },
    { label: '7 Days', value: 'last_7_days' },
  ]

  return (
    <Row style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
      <Col style={{ margin: '0 0 5px 5px' }}>
        <ButtonGroup size='small' aria-label='select chart range'>
          {dateRanges.map((range) => (
            <Button
              disableElevation
              key={range.value}
              variant={range.value === dateRange ? 'contained' : 'outlined'}
              color={range.value === dateRange ? 'primary' : 'default'}
              onClick={() => setDateRange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </ButtonGroup>
      </Col>

      <Col style={{ margin: '0 0 5px 5px' }}>
        <ButtonGroup size='small' aria-label='select chart range'>
          <Button
            disableElevation
            variant={!logScale ? 'contained' : 'outlined'}
            color={!logScale ? 'primary' : 'default'}
            onClick={() => setLogScale(false)}
          >
            Linear
          </Button>
          <Button
            disableElevation
            variant={logScale ? 'contained' : 'outlined'}
            color={logScale ? 'primary' : 'default'}
            onClick={() => setLogScale(true)}
          >
            Log
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  )
}

export default ChartOptionRow
