import React, { memo } from 'react'

import { Row, Col } from 'react-flexbox-grid'
import { Button, ButtonGroup } from '@material-ui/core'
import { ChartOptionsT, DateRangeT } from '../../types'

interface Props {
  options: ChartOptionsT
}

const ChartOptionRow: React.FC<Props> = ({ options: { dateRange, setDateRange, isLogarithmic, setIsLogarithmic } }) => {
  const dateRanges: { label: string; value: DateRangeT }[] = [
    { label: 'All', value: 'all' },
    { label: '1M', value: '1m' },
    { label: '7D', value: '1w' },
  ]

  return (
    <Row start='xs'>
      <Col style={{ margin: '0 0 1px 10px' }}>
        <ButtonGroup size='small' aria-label='select chart range'>
          {dateRanges.map((range) => (
            <Button
              style={{ fontSize: '10px', lineHeight: '10px' }}
              disableElevation
              size='small'
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

      <Col style={{ margin: '0 0 1px 10px', minWidth: '350px' }}>
        <ButtonGroup size='small' aria-label='select chart range'>
          <Button
            disableElevation
            size='small'
            style={{ fontSize: '10px', lineHeight: '10px' }}
            variant={!isLogarithmic ? 'contained' : 'outlined'}
            color={!isLogarithmic ? 'primary' : 'default'}
            onClick={() => setIsLogarithmic(false)}
          >
            Linear
          </Button>
          <Button
            disableElevation
            size='small'
            style={{ fontSize: '10px', lineHeight: '10px' }}
            variant={isLogarithmic ? 'contained' : 'outlined'}
            color={isLogarithmic ? 'primary' : 'default'}
            onClick={() => setIsLogarithmic(true)}
          >
            Log
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  )
}

export default memo(ChartOptionRow)
