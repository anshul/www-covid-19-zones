import React, { useState, useMemo } from 'react'
import { graphql } from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'
import { CustomLineChart_chart } from '../../__generated__/CustomLineChart_chart.graphql'
import { Typography, FormControlLabel, Theme, Checkbox, ButtonGroup, Button } from '@material-ui/core'
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Tooltip, Legend, YAxisProps, ResponsiveContainer } from 'recharts'
import { makeStyles, createStyles } from '@material-ui/styles'
import { slateGrey, slateBlue, summerSky, mountainMeadow, fireBush, flamingo, jaffa, orchid, purple } from '../../utils/ColorFactory'

interface Props {
  width?: number
  height?: number
  title?: string
  chart: CustomLineChart_chart
}
type DateRangeT = 'all_time' | 'last_30_days' | 'last_7_days'

const lineColors = [slateBlue, slateGrey, summerSky, mountainMeadow, fireBush, flamingo, jaffa, orchid, purple]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    headerAndControls: {
      display: 'flex',
      alignItems: 'center',
    },
    control: {
      marginLeft: theme.spacing(1),
    },
  })
)

const CustomLineChart: React.FC<Props> = ({ width, height, title, chart }) => {
  const classes = useStyles()
  const [dateRange, setDateRange] = useState<DateRangeT>('all_time')
  const dateRanges: { label: string; value: DateRangeT }[] = [
    { label: 'All Time', value: 'all_time' },
    { label: 'Last 30 Days', value: 'last_30_days' },
    { label: 'Last 7 Days', value: 'last_7_days' },
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
    <div className={classes.root}>
      <div className={classes.headerAndControls}>
        {title && <Typography variant='h6'>{title}</Typography>}
        <ButtonGroup size='small' className={classes.control}>
          {dateRanges.map((range) => (
            <Button color={dateRange === range.value ? 'primary' : 'default'} onClick={() => setDateRange(range.value)} key={range.value}>
              {range.label}
            </Button>
          ))}
        </ButtonGroup>
        <FormControlLabel
          control={
            <Checkbox color='primary' checked={logScale} onClick={() => setLogScale((prevState) => !prevState)} className={classes.control} />
          }
          label='Log Scale'
        />
      </div>
      <ResponsiveContainer width={width ?? '100%'} height={height ?? '100%'}>
        <LineChart data={filteredDate as any[]}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey={chart.xAxisKey} />
          <YAxis interval="preserveStartEnd" allowDataOverflow={true} {...yAxisProps} orientation="right" />
          <Tooltip />
          <Legend verticalAlign='top' align='left' />
          {chart.lineKeys.map((dataKey, idx) => {
            const color = lineColors[idx % lineColors.length][500]
            return <Line key={dataKey} type='monotone' dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ strokeWidth: 1, fill: color }} />
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
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
