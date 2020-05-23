// @ts-nocheck
import { createStyles, makeStyles } from '@material-ui/core'
import * as d3 from 'd3'
import React, { memo, useEffect } from 'react'
import useResponsiveView from '../../hooks/useResponsiveView'
import { DateRangeT, UrlT } from '../../types'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'
import * as d3Array from 'd3-array'

interface Props {
  zoneColor: d3.ScaleOrdinal<string, string>
  data: V2HomeRoot_data | null
  codes: string[]
  go: (target: UrlT) => void
  mode: string
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

const TrendChart: React.FC<Props> = ({ data, go, mode, codes, zoneColor }) => {
  const classes = useStyles()
  const view = useResponsiveView({ marginTop: 20, marginLeft: 40, marginBottom: 30, marginRight: 50 })
  const threshold = 10

  useEffect(() => {
    console.log('render trend chart', { data })
    const maybeDiv: unknown = view.ref.current
    if (!maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement
    const svg = d3.select(el).select('svg')
    const dot = svg.select('g.dot')
    console.log('d3 update: trend chart', {
      w: view.width,
      h: view.height,
      iw: view.innerWidth,
      ih: view.innerHeight,
      m: [view.marginTop, view.marginRight, view.marginBottom, view.marginLeft],
    })

    if (!data) return

    const filteredZones = data.zones
      .map((z) => ({
        ...z,
        chart: z.chart.filter((day) => day && day.totInf > threshold).map((day, idx) => ({ ...day, dayCount: idx })),
      }))
      .filter((z) => z.chart && z.chart.length >= 1)
    const y = d3
      .scaleLog()
      .domain([threshold, d3.max(filteredZones.flatMap((z) => z.chart.map((day) => day.totInf)))])
      .range([view.height - view.marginBottom, view.marginTop])
      .nice()
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(filteredZones.map((z) => z.chart.length)) + 20])
      .range([view.marginLeft, view.width - view.marginRight])

    svg
      .select('.xAxis')
      .attr('transform', `translate(0, ${view.height - view.marginBottom})`)
      .call(d3.axisBottom(x).ticks(view.innerWidth / 70))
    svg.select('.yAxis').attr('transform', `translate(${view.marginLeft},0)`).call(d3.axisLeft(y))

    const trendLine = d3
      .line()
      .x((d, i) => x(i))
      .y((d) => y(d.totInf))
    const updateTrendLine = (d) =>
      d
        .attr('d', (d) => trendLine(d.chart))
        .attr('stroke', (d) => zoneColor(d.code))
        .attr('fill', 'none')
    const enterTrendLine = (d) => d.append('path').attr('class', 'line').call(updateTrendLine)

    const updateLineLabel = (d) => d.attr('x', (d) => x(d.chart.length)).attr('y', (d) => y(d.chart[d.chart.length - 1].totInf))
    const enterLineLabel = (d) =>
      d
        .append('text')
        .attr('class', 'line-label')
        .text((d) => d.name)
        .call(updateLineLabel)

    const trends = svg.select('.lines').selectAll('g')
    trends
      .data(filteredZones, (d) => d.code)
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('id', (d) => d.code)
            .call(enterTrendLine)
            .call(enterLineLabel),
        (update) => update.call((d) => updateTrendLine(d.select('path.line'))).call((d) => updateLineLabel(d.select('text.line-label'))),
        (exit) => exit.remove()
      )

    svg.on('mouseenter', entered).on('mousemove', moved)

    function entered() {
      dot.attr('display', null)
    }

    function moved() {
      const xValue = Math.round(x.invert(d3.event.layerX))
      if (xValue < 0) return

      const zoneValue = (z) => z.chart[xValue].totInf
      const distance = (z) => Math.abs(y(zoneValue(z)) - d3.event.layerY)

      const candidateZones = filteredZones.filter((z) => z.chart.length > xValue).filter((z) => distance(z) < 50)
      const closestZone = d3Array.least(candidateZones, (z) => distance(z))

      if (!closestZone) {
        left()
        return
      } else {
        entered()
      }

      const prev = xValue > 0 ? closestZone.chart[xValue - 1] : closestZone.chart[xValue]
      const next = xValue < closestZone.chart.length - 1 ? closestZone.chart[xValue + 1] : closestZone.chart[xValue]

      const period = (next.dayCount - prev.dayCount) / (Math.log2(next.totInf) - Math.log2(prev.totInf))
      const periodFmt = d3.format('.0f')

      dot.attr('transform', `translate(${x(xValue)}, ${y(zoneValue(closestZone))})`)
      dot.select('text.count').text(zoneValue(closestZone))
      dot.select('text.doubling-label').text(`doubling every ${periodFmt(period)} days`)
    }

    function left() {
      dot.attr('display', 'none')
    }

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
    zoneColor,
  ])

  return (
    <>
      <div ref={view.ref} className={classes.chartRoot}>
        <svg className={classes.svgRoot} preserveAspectRatio='xMidYMid meet' width={view.width} height={view.height}>
          <g className='lines' />
          <g className='xAxis' />
          <g className='yAxis' />
          <g className='lineLabels' />
          <g className='dot'>
            <circle r='2.5' />
            <text className='count' textAnchor='middle' y={-18}></text>
            <text className='doubling-label' textAnchor='middle' y={-7}></text>
          </g>
        </svg>
      </div>
    </>
  )
}

export default memo(TrendChart)
