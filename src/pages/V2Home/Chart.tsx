// @ts-nocheck

import { createStyles, makeStyles } from '@material-ui/styles'
import * as d3 from 'd3'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Button from '../../components/Button'
import { useChartDimensions } from '../../hooks/useChartDimensions'
import { DateRangeT, UrlT } from '../../types'
import { filterData } from '../../utils/filterData'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'

const useStyles = makeStyles(() =>
  createStyles({
    chartRoot: {
      // border: '1px dashed red',
      fontWeight: 700,
    },
    rangeContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    button: {
      fontWeight: 700,
    },
    selectedButton: {
      fontWeight: 700,
      color: '#2972DF',
      border: 'none',
      // "& > .MuiButton-label::after": {
      //   content: "",
      //   borderBottom: "2px solid #2972DF",
      //   paddingBottom: "5px"
      // }
    },
  })
)
declare global {
  interface Window {
    c: any
  }
}
interface Props {
  data: V2HomeRoot_data | null
  go: (target: UrlT) => void
  mode: string
  dateRange: DateRangeT
  logScale: boolean
}

window.c = window.c || { d3 }

const chartSettings = {
  marginLeft: 50,
  marginBottom: 30,
  marginTop: 10,
  marginRight: -40,
}

const Chart: React.FC<Props> = ({ mode, data, go, dateRange, logScale }) => {
  const [chartData, setChartData] = useState([])
  const [dtRange, setdtRange] = useState(dateRange)
  const classes = useStyles()
  const chartRef = useRef(null)
  const dms = useChartDimensions(chartRef, chartSettings)

  const transformData = useCallback(
    (data) => {
      const firstZone = data && data.zones[0]
      if (firstZone && firstZone.chart.length > 1) {
        const filteredData = filterData(dtRange, firstZone.chart)
        setChartData(filteredData)
      }
    },
    [dtRange]
  )

  useEffect(() => {
    transformData(data)
  }, [dtRange, data, transformData])

  const generateChart = useCallback(
    (values) => {
      const maybeDiv: unknown = chartRef.current
      if (!values || !maybeDiv) return
      const el: HTMLElement = maybeDiv as HTMLElement

      const svg = d3.select(el).select('svg')

      const newInf = svg.select('.newInf')
      const xAxisG = svg.select('.xAxis')
      const yAxisG = svg.select('.yAxis')

      const rect = newInf.selectAll('rect').data(values)

      const allDates = [...new Set(values.map((d) => new Date(d.dt)))].map((d) => new Date(d))
      const dateMin = d3.min(allDates)
      const dateMax = new Date()
      const numTicksX = dms.width < 480 ? 4 : 7

      const x = d3.scaleUtc().domain([dateMin, dateMax]).range([dms.marginLeft, dms.boundedWidth])

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(values, (d) => +d.newInf)])
        .range([dms.boundedHeight, dms.marginTop])
        .nice()

      const xAxis = (g) =>
        g
          .attr('transform', `translate(0,${dms.boundedHeight + 15})`)
          .call(d3.axisBottom(x).ticks(numTicksX).tickFormat(d3.utcFormat('%b %d')).tickSizeOuter(0))
          .call((g) => g.select('.domain').attr('stroke', '#A4A4A4'))
          .call((g) => g.selectAll('.tick').select('line').attr('stroke', '#A4A4A4'))

      xAxisG.call(xAxis)

      const yAxis = (g) =>
        g
          .attr('transform', `translate(${dms.marginLeft - 10},0)`)
          .call(d3.axisLeft(y).ticks(null, 's'))
          .call((g) => g.select('.domain').remove())
          .call((g) => g.selectAll('.tick').select('line').remove())
          .call((g) => g.append('text').attr('x', -dms.marginLeft).attr('y', 10).attr('text-anchor', 'start').text(data.y))

      yAxisG.call(yAxis)

      const barWidth = dms.width < 480 ? 2 : 4

      rect
        .enter()
        .append('rect')
        .attr('x', (d) => x(new Date(d.dt)) - barWidth / 3)
        .attr('y', (d) => y(d.newInf))
        .attr('height', (d) => Math.max(y(0) - y(d.newInf), 0))
        .attr('width', barWidth)
        .attr('fill', (d) => (d.newInf > 500 ? '#F07F80' : '#6772e5'))
    },
    [data, chartRef, dms]
  )

  useEffect(() => {
    if (chartData.length > 1) generateChart(chartData)
  }, [chartData, generateChart])

  return (
    <>
      <div className={classes.rangeContainer}>
        <Button onClick={() => setdtRange('all')} className={dtRange === 'all' ? classes.selectedButton : classes.button}>
          ALL
        </Button>
        <Button onClick={() => setdtRange('1m')} className={dtRange === '1m' ? classes.selectedButton : classes.button}>
          1M
        </Button>
        <Button onClick={() => setdtRange('1w')} className={dtRange === '1w' ? classes.selectedButton : classes.button}>
          1W
        </Button>
      </div>
      <div ref={chartRef} className={classes.chartRoot} style={{ height: '300px' }}>
        <svg preserveAspectRatio='xMidYMid meet' width={dms.width} height={dms.height}>
          <g className='newInf' />
          <g className='xAxis' />
          <g className='yAxis' />
        </svg>
      </div>
    </>
  )
}

export default Chart
