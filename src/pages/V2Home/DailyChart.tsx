// @ts-nocheck
import React, { memo, useEffect } from 'react'
import * as d3 from 'd3'
import { createStyles, makeStyles } from '@material-ui/core'
import useResponsiveView from '../../hooks/useResponsiveView'
import { DateRangeT, UrlT } from '../../types'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'

interface Props {
  data: V2HomeRoot_data | null
  zoneColor: d3.ScaleOrdinal<string, string>
  codes: string[]
  go: (target: UrlT) => void
  mode: string
  dateRange: DateRangeT
  isLogarithmic: boolean
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

const DailyChart: React.FC<Props> = ({ data, go, mode, codes, dateRange, isLogarithmic, zoneColor }) => {
  const classes = useStyles()
  const view = useResponsiveView({ marginTop: 5, marginLeft: 5, marginBottom: 30, marginRight: 50 })

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
    const y = d3.scaleLinear().domain([minValue, maxValue]).nice().range([view.innerHeight, view.marginTop])

    const barWidth =
      Math.floor((x.range()[1] - x.range()[0]) / data.zones.flatMap((zone) => zone.chart.map((point) => parseDt(point.dt))).length) - 1

    const gXAxis = svg.select('.xAxis')
    gXAxis.attr('transform', `translate(0, ${view.height - view.marginBottom})`).call(d3.axisBottom(x).ticks(view.innerWidth / 70))
    const gYAxis = svg.select('.yAxis')
    gYAxis.attr('transform', `translate(${view.width - view.marginRight},0)`).call(d3.axisRight(y))

    const t = d3.transition().duration(1000)
    const gChart = svg.select('.chart')
    gChart.selectAll('.dot').exit().remove()
    gChart.selectAll('.line').exit().remove()
    const newInfLine = d3
      .line()
      .x((d) => x(parseDt(d.dt)))
      .y((d) => y(d.newInfSma5))

    const chartUpdater = (selection) =>
      selection
        .classed('bar', true)
        .attr('fill', () => 'coral')
        .attr('x', (d) => x(parseDt(d.dt)) - barWidth / 2)
        .attr('y', (d) => y(d.newInf))
        .attr('width', barWidth)
        .attr('height', (d) => view.innerHeight - y(d.newInf))

    const lineUpdater = (selection) =>
      selection
        .classed('line', true)
        .attr('d', (d) => newInfLine(d.chart))
        .style('fill', 'none')
        .style('stroke', (d) => zoneColor[d.code])
        .style('stroke-width', 4)

    gChart
      .selectAll('.bar')
      .data(data.zones[0].chart)
      .join(
        (enter) => enter.append('rect').call(chartUpdater),
        (update) => update.call(chartUpdater),
        (exit) => exit.call((exit) => exit.transition(t).attr('opacity', 0).remove())
      )

    gChart
      .selectAll('.line')
      .data(data.zones, (d) => d.code)
      .join(
        (enter) => enter.append('path').call(lineUpdater),
        (update) => update.call(lineUpdater),
        (exit) => exit.call((exit) => exit.transition(t).attr('opacity', 0).remove())
      )

    // const legend = svg.select('.legend')
    // legend.attr('transform', `translate(${view.marginLeft},${view.marginTop})`)

    // const legendX = 20
    // const legendRectWidth = 40
    // const legendRectHeight = 20
    // const legendUpdater = (selection) =>
    //   selection
    //     .call((selection) =>
    //       selection
    //         .append('rect')
    //         .attr('width', legendRectWidth)
    //         .attr('height', legendRectHeight)
    //         .attr('x', legendX)
    //         .attr('y', (_, i) => i * legendRectHeight + i * 10)
    //         .style('fill', (d) => zoneColor[d.code])
    //     )
    //     .call((selection) =>
    //       selection
    //         .append('text')
    //         .attr('x', legendX + legendRectWidth + 10)
    //         .attr('y', (_, i) => i * legendRectHeight + i * 10)
    //         .attr('alignment-baseline', 'hanging')
    //         .text((d) => d.name)
    //     )
    // legend
    //   .selectAll('g')
    //   .data(data.zones, (d) => d.code)
    //   .join(
    //     (enter) => enter.append('g').call(legendUpdater),
    //     (update) => update.call(legendUpdater),
    //     (exit) => exit.remove()
    //   )

    return () => {
      console.log('d3 cleanup')
    }
  }, [
    zoneColor,
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
          <g className='legend' />
        </svg>
      </div>
    </>
  )
}

export default memo(DailyChart)
