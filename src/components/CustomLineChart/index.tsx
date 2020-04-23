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
import { slateBlue, summerSky, mountainMeadow, fireBush, flamingo, jaffa, orchid, purple } from '../../utils/ColorFactory'
import { Grid, Col, Row } from 'react-flexbox-grid'

interface Props {
  width?: number
  height?: number
  title?: string
  lineKeys: ReadonlyArray<string>
  xAxisKey: string
  data: any
  logScale?: boolean
}

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

const CustomLineChart: React.FC<Props> = ({ width, height, title, data, xAxisKey, lineKeys, logScale = false }) => {
  const classes = useStyles()
  const yAxisProps: YAxisProps = logScale ? { scale: 'log', domain: [0.1, 'dataMax'] } : {}

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
                  <h5>{title}</h5>
                  <h4 className={classes.tootipTitle}>{payload.map((pl) => pl.payload.date)[0]}</h4>
                  {payload.map((pl) => (
                    <div key={pl.name} className={classes.tooltipItemContainer}>
                      <div className={classes.tooltipItemIcon} style={{ backgroundColor: pl.color }} />
                      <p>{pl.value} cases</p>
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
                  <p>{title}</p>
                </Col>
                <Col xs>
                  <Row end='xl'>
                    {payload?.map((pl) => (
                      <div key={pl.value} className={classes.legendItem}>
                        <div className={classes.legendItemIcon} style={{ backgroundColor: pl.color }} />
                        <p>{pl.value}</p>
                      </div>
                    ))}
                  </Row>
                </Col>
              </Row>
            )}
          />
          {lineKeys.map((dataKey, idx) => {
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
    </Grid>
  )
}

export default CustomLineChart
