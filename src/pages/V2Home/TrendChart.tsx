// @ts-nocheck
import { createStyles, makeStyles } from '@material-ui/core'
import * as d3 from 'd3'
import React, { memo, useEffect } from 'react'
import useResponsiveView from '../../hooks/useResponsiveView'
import { DateRangeT, UrlT } from '../../types'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'

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
      height: '500px',
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

const TrendChart: React.FC<Props> = ({ data, go, mode, codes, dateRange, logScale, colorMap }) => {
  const classes = useStyles()
  const view = useResponsiveView({ marginTop: 20, marginLeft: 40, marginBottom: 30, marginRight: 50 })
  const threshold = 10

  useEffect(() => {
    console.log('render trend chart', { data })
    const maybeDiv: unknown = view.ref.current
    if (!maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement
    const svg = d3.select(el).select('svg')
    console.log('d3 update: trend chart', {
      w: view.width,
      h: view.height,
      iw: view.innerWidth,
      ih: view.innerHeight,
      m: [view.marginTop, view.marginRight, view.marginBottom, view.marginLeft],
    })

    if (!data) return

    const filteredZones = data.zones.map((z) => ({ ...z, chart: z.chart.filter((day) => day.totInf > threshold) }))
    const y = d3
      .scaleLog()
      .domain([threshold, d3.max(filteredZones.flatMap((z) => z.chart.map((day) => day.totInf)))])
      .range([view.height - view.marginBottom, view.marginTop])
      .nice()
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(filteredZones.map((z) => z.chart.length)) + 20])
      .range([view.marginLeft, view.width - view.marginRight])

    const trendLine = d3
      .line()
      .x((_, i) => x(i))
      .y((d) => y(d.totInf))

    const trendlineUpdater = (selection) =>
      selection
        .attr('d', (d) => trendLine(d.chart))
        .attr('stroke', 'black')
        .attr('fill', 'none')

    svg
      .select('.lines')
      .selectAll('path')
      .data(filteredZones, (d) => d.code)
      .join(
        (enter) => enter.append('path').call(trendlineUpdater),
        (update) => update.call(trendlineUpdater),
        (exit) => exit.remove()
      )

    const lineLabelUpdater = (selection) =>
      selection
        .text((d) => d.name)
        .attr('x', (d) => x(d.chart.length))
        .attr('y', (d) => y(d.chart[d.chart.length - 1].totInf))

    svg
      .select('.lineLabels')
      .selectAll('text')
      .data(filteredZones, (d) => d.code)
      .join(
        (enter) => enter.append('text').call(lineLabelUpdater),
        (update) => update.call(lineLabelUpdater),
        (exit) => exit.remove()
      )

    svg
      .select('.xAxis')
      .attr('transform', `translate(0, ${view.height - view.marginBottom})`)
      .call(d3.axisBottom(x).ticks(view.innerWidth / 70))
    svg.select('.yAxis').attr('transform', `translate(${view.marginLeft},0)`).call(d3.axisLeft(y))

    return () => {
      console.log('d3 cleanup')
    }
  }, [
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
          <g className='lines' />
          <g className='xAxis' />
          <g className='yAxis' />
          <g className='lineLabels' />
        </svg>
      </div>
    </>
  )
}

export default memo(TrendChart)
