// @ts-nocheck
import React, { useEffect, memo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core'
import * as d3 from 'd3'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'
import useResponsiveView from '../../hooks/useResponsiveView'
import { DateRangeT, UrlT } from '../../types'

interface Props {
  colorMap: {
    [code: string]: string
  }
  data: V2HomeRoot_data | null
  codes: string[]
  go: (target: UrlT) => void
  mode: string
  dateRange: DateRangeT
  logScale: boolean
}

const useStyles = makeStyles(() =>
  createStyles({
    chartRoot: {
      height: '400px',
      minWidth: '400px',
      position: 'relative',
    },
    svgRoot: {
      border: '1px solid #eee',
    },
    pre: {
      whiteSpace: 'pre-wrap',
    },
  })
)

const DailyChart: React.FC<Props> = ({ data, go, mode, codes, dateRange, logScale, colorMap }) => {
  const classes = useStyles()
  const view = useResponsiveView({ marginTop: 5, marginLeft: 50, marginBottom: 30, marginRight: 5 })

  useEffect(() => {
    console.log('render daily chart', { data })
    const maybeDiv: unknown = view.ref.current
    if (!maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement
    const svg = d3.select(el).select('svg')
    console.log('d3 update', {
      w: view.width,
      h: view.height,
      iw: view.innerWidth,
      ih: view.innerHeight,
      m: [view.marginTop, view.marginRight, view.marginBottom, view.marginLeft],
    })

    if (!data) return

    const parseTime = d3.timeParse('%Y-%m-%d')
    const parseDt = (dt: string): Date => parseTime(dt) || new Date()
    const minDate = d3.min(data.zones.flatMap((zone) => zone.chart.map((point) => parseDt(point.dt)))) || new Date('2020', 3, 1)
    const maxDate = d3.max(data.zones.flatMap((zone) => zone.chart.map((point) => parseDt(point.dt)))) || new Date()

    const minValue = d3.min(data.zones.flatMap((zone) => zone.chart.map((point) => point.newInf))) || 0
    const maxValue = d3.max(data.zones.flatMap((zone) => zone.chart.map((point) => point.newInf))) || 100

    const x = d3.scaleTime().domain([minDate, maxDate]).range([view.marginLeft, view.innerWidth])
    const y = d3.scaleLinear().domain([minValue, maxValue]).range([view.innerHeight, view.marginTop])

    const gXAxis = svg.select('.xAxis')
    gXAxis.attr('transform', `translate(0, ${view.height - view.marginBottom})`).call(d3.axisBottom(x).ticks(view.innerWidth / 70))
    const gYAxis = svg.select('.yAxis')
    gYAxis.attr('transform', `translate(${view.marginLeft},0)`).call(d3.axisLeft(y))

    const t = d3.transition().duration(1000)
    const gChart = svg.select('.chart')
    const newInfLine = d3
      .line()
      .x((d) => x(parseDt(d.dt)))
      .y((d) => y(d.newInf))
    const updater = (selection) =>
      selection
        .attr('d', (d) => newInfLine(d.chart))
        .style('fill', 'none')
        .style('stroke', (d) => colorMap[d.code])
        .style('stroke-width', 2)
    gChart
      .selectAll('path')
      .data(data.zones, (d) => d.code)
      .join(
        (enter) => enter.append('path').call(updater),
        (update) => update.call(updater),
        (exit) => exit.call((exit) => exit.transition(t).attr('opacity', 0).remove())
      )

    return () => {
      console.log('d3 cleanup')
    }
  }, [
    colorMap,
    data,
    view.height,
    view.innerHeight,
    view.innerWidth,
    view.marginBottom,
    view.marginLeft,
    view.marginRight,
    view.marginTop,
    view.ref,
    view.width,
  ])

  return (
    <>
      <div ref={view.ref} className={classes.chartRoot}>
        <svg className={classes.svgRoot} preserveAspectRatio='xMidYMid meet' width={view.width} height={view.height}>
          <g className='chart' />
          <g className='xAxis' />
          <g className='yAxis' />
        </svg>
      </div>
    </>
  )
}

export default memo(DailyChart)
