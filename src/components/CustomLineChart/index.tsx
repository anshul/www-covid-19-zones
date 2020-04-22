import React, { useState, useMemo } from 'react'
import { graphql } from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import { CustomLineChart_chart } from '../../__generated__/CustomLineChart_chart.graphql'
import { Theme } from '@material-ui/core'
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Legend,
  YAxisProps,
  ResponsiveContainer,
  TooltipProps,
  LegendProps,
} from 'recharts'
import { makeStyles, createStyles } from '@material-ui/styles'
import { slateBlue, summerSky, mountainMeadow, fireBush, flamingo, jaffa, orchid, purple } from '../../utils/ColorFactory'
import Button from '../Button'
import { Grid, Col, Row } from 'react-flexbox-grid'

interface Props {
  width?: number
  height?: number
  title?: string
  chart: CustomLineChart_chart
}
type DateRangeT = 'all_time' | 'last_30_days' | 'last_7_days'

const lineColors = [slateBlue, mountainMeadow, summerSky, fireBush, flamingo, jaffa, orchid, purple]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    control: {
      marginLeft: theme.spacing(1),
    },
    tooltipContent: {
      padding: '8px 16px',
      backgroundColor: 'white',
      borderRadius: theme.spacing(0.5),
      boxShadow: '0 10px 24px 0 rgba(0,0,0, 0.12)',
    },
    tooltipItemContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    tooltipItemIcon: {
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      marginRight: theme.spacing(0.5),
    },
    legendContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    legendItemContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    legendItem: {
      marginRight: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
    },
    legendItemIcon: {
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      marginRight: theme.spacing(0.5),
    },
  })
)

const CustomLineChart: React.FC<Props> = ({ width, height, title, chart }) => {
  const classes = useStyles()
  const [dateRange, setDateRange] = useState<DateRangeT>('all_time')
  const dateRanges: { label: string; value: DateRangeT }[] = [
    { label: 'All Time', value: 'all_time' },
    { label: '1 Month', value: 'last_30_days' },
    { label: '7 Days', value: 'last_7_days' },
  ]

  const [logScale, setLogScale] = useState(false)
  const yAxisProps: YAxisProps = logScale ? { scale: 'log', domain: [0.1, 'dataMax'] } : {}
  const filteredDate = useMemo(() => {
    switch (dateRange) {
      case 'all_time':
        return chart.data
      case 'last_30_days':
        return chart.data.slice(chart.data.length - 30)
      case 'last_7_days':
        return chart.data.slice(chart.data.length - 7)
    }
  }, [chart.data, dateRange])

  return (
    <Grid className={classes.root}>
      <Row>
        <Col xs={12}>
          <h5>Total Confirmed Cases</h5>
          <h3>
            {chart.data
              .map((d: any) => d[chart.lineKeys[0]])
              .reduce((a, b) => {
                return a + b
              }, 0)}
          </h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6} xl={6} style={{ margin: '8px 0' }}>
          {dateRanges.map((range) => (
            <Button
              disableElevation
              variant={range.value === dateRange ? 'contained' : 'text'}
              color={range.value === dateRange ? 'primary' : 'default'}
              onClick={() => setDateRange(range.value)}
              key={range.value}
            >
              {range.label}
            </Button>
          ))}
        </Col>
        <Col xs={12} md={6} xl={6} style={{ margin: '8px 0' }}>
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
      <Col xs={12}>
        <ResponsiveContainer width={width ?? '100%'} height={height ?? '100%'}>
          <LineChart data={filteredDate as any[]}>
            <CartesianGrid strokeOpacity={0.5} vertical={false} />
            <XAxis
              padding={{ left: 16, right: 16 }}
              dataKey={chart.xAxisKey}
              tick={({ x, y, payload }: any) => (
                <g transform={`translate(${x},${y})`}>
                  <text x={0} y={0} dx={16} dy={16} fontSize={12} textAnchor='end' fill='#666'>
                    {payload.value}
                  </text>
                </g>
              )}
            />
            <YAxis
              padding={{ top: 16, bottom: 0 }}
              interval='preserveStartEnd'
              allowDecimals={false}
              allowDataOverflow={true}
              {...yAxisProps}
              orientation='left'
              tick={({ x, y, payload }: any) => (
                <g transform={`translate(${x},${y})`}>
                  <text x={0} y={0} dx={0} dy={4} fontSize={12} textAnchor='end' fill='#666'>
                    {logScale ? Number.parseFloat(payload.value).toFixed(2) : payload.value}
                  </text>
                </g>
              )}
            />
            <Tooltip
              content={({ payload }: TooltipProps) => (
                <div className={classes.tooltipContent}>
                  {payload?.map((pl) => (
                    <div className={classes.tooltipItemContainer}>
                      <div className={classes.tooltipItemIcon} style={{ backgroundColor: pl.color }} />
                      <p>{pl.value} cases</p>
                    </div>
                  ))}
                </div>
              )}
            />
            <Legend
              verticalAlign='top'
              align='right'
              iconType='square'
              wrapperStyle={{
                marginBottom: '16px',
                borderBottom: '1px solid #e4e4e4',
              }}
              content={({ payload }: LegendProps) => (
                <Row>
                  <Col xs={12}>
                    <h3>{title}</h3>
                  </Col>
                  <Col xs={12} xl={6}>
                    <p>some details</p>
                  </Col>
                  <Col xs={12} xl={6}>
                    <div className={classes.legendItemContainer}>
                      {payload?.map((pl) => (
                        <div className={classes.legendItem}>
                          <div className={classes.legendItemIcon} style={{ backgroundColor: pl.color }} />
                          <p>{pl.value}</p>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              )}
            />
            {chart.lineKeys.map((dataKey, idx) => {
              const color = lineColors[idx % lineColors.length][500]
              return (
                <Line
                  key={dataKey}
                  type='monotone'
                  dataKey={dataKey}
                  connectNulls={true}
                  animationDuration={300}
                  stroke={color}
                  strokeWidth={4}
                  dot={false}
                  activeDot={{ strokeWidth: 7, fill: fireBush[500], r: 7, boxShadow: '0 3px 8px 0 rgba(0,0,0,0.24)' }}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </Col>
    </Grid>
  )
}

export default createFragmentContainer(CustomLineChart, {
  chart: graphql`
    fragment CustomLineChart_chart on LineChart {
      xAxisKey
      lineKeys
      data
    }
  `,
})
