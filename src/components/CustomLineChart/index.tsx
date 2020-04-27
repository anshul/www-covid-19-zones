import React from 'react'

import { Theme } from '@material-ui/core'
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  LegendProps,
  YAxisProps,
} from 'recharts'
import { makeStyles, createStyles } from '@material-ui/styles'
import { lineColors, pairedColors, fireBush } from '../../utils/ColorFactory'
import { Grid, Col, Row } from 'react-flexbox-grid'

interface Props {
  palette: 'paired' | 'normal'
  width?: number
  height?: number
  title?: string
  lineKeys: ReadonlyArray<string>
  xAxisKey: string
  data: any
  legend?: { [lineKey: string]: string }
  logScale?: boolean
}

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
    tootipTitle: {
      fontSize: '14px',
      paddingBottom: '8px',
    },
    tooltipItemContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: '4px 0',
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

const CustomLineChart: React.FC<Props> = ({ width, legend, palette, height, title, data, xAxisKey, lineKeys, logScale = false }) => {
  const classes = useStyles()
  const yAxisProps: YAxisProps = logScale ? { scale: 'log', domain: [0.1, 'dataMax'] } : {}
  const colors = palette === 'normal' ? lineColors : pairedColors

  return (
    <Grid className={classes.root}>
      <ResponsiveContainer width={width ?? '100%'} height={height ?? '100%'}>
        <LineChart data={data as any[]} style={{ paddingTop: '16px' }}>
          <CartesianGrid strokeOpacity={0.5} horizontal={false} />
          <XAxis
            padding={{ left: 16, right: 16 }}
            dataKey={xAxisKey}
            tick={({ x, y, payload }) => (
              <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dx={16} dy={16} fontSize={12} textAnchor='end' fill='#666'>
                  {payload.value}
                </text>
              </g>
            )}
          />
          <YAxis
            type='number'
            width={40}
            padding={{ top: 16, bottom: 0 }}
            interval='preserveStartEnd'
            allowDecimals={false}
            allowDataOverflow={true}
            {...yAxisProps}
            orientation='left'
            tick={({ x, y, payload }) => (
              <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dx={0} dy={4} fontSize={12} textAnchor='end' fill='#666'>
                  {logScale
                    ? Number.parseFloat(payload.value) < 1
                      ? Number.parseFloat(payload.value).toFixed(1)
                      : Number.parseFloat(payload.value).toFixed(0)
                    : payload.value}
                </text>
              </g>
            )}
          />
          <Tooltip
            content={({ payload }: TooltipProps) =>
              payload && (
                <div className={classes.tooltipContent}>
                  <h5 className={classes.tootipTitle}>
                    <strong>{payload.map((pl) => pl.payload.date)[0]}</strong>
                  </h5>
                  {payload.map((pl, idx) => (
                    <div key={pl.name} className={classes.tooltipItemContainer}>
                      <div className={classes.tooltipItemIcon} style={{ backgroundColor: pl.color }} />
                      <small>
                        {pl.value} {lineKeys[idx].toLowerCase()}
                      </small>
                    </div>
                  ))}
                </div>
              )
            }
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
              <Row start='xl'>
                <Col xl={4} xs={12} style={{ padding: '0' }}>
                  <p style={{ fontWeight: 500 }}>{title}</p>
                </Col>
                <Col xs>
                  <Row end='xl'>
                    {payload?.map((pl) => (
                      <div key={pl.value} className={classes.legendItem}>
                        <div className={classes.legendItemIcon} style={{ backgroundColor: pl.color }} />
                        <small>{(legend && legend[pl.value]) || pl.value}</small>
                      </div>
                    ))}
                  </Row>
                </Col>
              </Row>
            )}
          />
          {lineKeys.map((dataKey, idx) => {
            const color = colors[idx % colors.length][500]
            return (
              <Line
                key={dataKey}
                type='monotone'
                dataKey={dataKey}
                connectNulls={true}
                animationDuration={300}
                stroke={color}
                strokeWidth={3}
                dot={false}
                activeDot={{ strokeWidth: 7, fill: fireBush[500], r: 7, boxShadow: '0 3px 8px 0 rgba(0,0,0,0.24)' }}
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    </Grid>
  )
}

export default CustomLineChart
