// @ts-nocheck
import React, { useRef, useEffect } from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import * as d3 from 'd3'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'
import { DateRangeT, UrlT } from '../../types'

const useStyles = makeStyles(() =>
  createStyles({
    chartRoot: {
      border: '1px dashed red',
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

const margin = { top: 30, right: 10, bottom: 50, left: 50 }
const height = 500
const width = 400

const Chart: React.FC<Props> = ({ mode, data, go, dateRange, logScale }) => {
  const classes = useStyles()
  const chartRef = useRef(null)
  const firstZone = data && data.zones[0]
  useEffect(() => {
    const maybeDiv: unknown = chartRef.current
    if (!data || !firstZone || !maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement

    const svg = d3.select(el)
    const newInf = svg.select('.newInf')
    const xAxisG = svg.select('.xAxis')
    const yAxisG = svg.select('.yAxis')
    const values = firstZone.chart as any

    const rect = newInf.selectAll('rect').data(values)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(values, (d) => +(d as any).newInf) || 0])
      .range([height - margin.bottom, margin.top])

    const x = d3
      .scaleBand()
      .domain(d3.range(values.length as any) as any)
      .range([margin.left, width - margin.right])
      .padding(0.25)

    const xAxis = (g: any) =>
      g.attr('transform', `translate(0,${height - margin.bottom})`).call(
        d3
          .axisBottom(x)
          .tickFormat((i) => values[i].dt)
          .tickSizeOuter(0)
      )
    xAxisG.call(xAxis)

    const yAxis = (g: any) =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, 's'))
        .call((g: any) => g.select('.domain').remove())
        .call((g: any) =>
          g.append('text').attr('x', -margin.left).attr('y', 10).attr('fill', 'currentColor').attr('text-anchor', 'start').text(data.y)
        )
    yAxisG.call(yAxis)

    rect
      .enter()
      .append('rect')
      .attr('x', (d, i) => x(i as any) as any)
      .attr('y', (d) => y((d as any).newInf))
      .attr('height', (d) => y(0) - y((d as any).newInf))
      .attr('width', x.bandwidth())
      .attr('fill', (d) => (d.newInf > 500 ? 'red' : 'blue'))

    console.log('d3 update', el, svg)

    return () => {
      console.log('d3 cleanup')
    }
  }, [data, firstZone, firstZone && firstZone.chart])

  return (
    <>
      <div className={classes.chartRoot}>
        <svg ref={chartRef} preserveAspectRatio='xMidYMid meet' style={{ width: `${width}px`, height: `${height}px` }}>
          <g className='newInf' />
          <g className='xAxis' />
          <g className='yAxis' />
        </svg>
      </div>

      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data)}</pre>
    </>
  )
}

export default Chart
