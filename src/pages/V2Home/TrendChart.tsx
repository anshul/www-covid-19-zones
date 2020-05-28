// @ts-nocheck
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import * as d3 from 'd3'
import * as d3Array from 'd3-array'
import React, { memo, useEffect } from 'react'
import { Col, Row } from 'react-flexbox-grid'
import useResponsiveView from '../../hooks/useResponsiveView'
import { UrlT } from '../../types'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'

interface Props {
  zoneColor: d3.ScaleOrdinal<string, string>
  data: V2HomeRoot_data | null
  codes: string[]
  go: (target: UrlT) => void
  mode: string
  highlighted: { [key: string]: boolean | undefined | null }
  setHighlight: (key: string) => void
}

const fadedOpacity = 0.5
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chartRoot: {
      height: '100%',
      minWidth: '300px',
      position: 'relative',
    },
    lineLabel: {
      fontSize: '12px',
    },
    svgRoot: {
      border: '1px solid #eee',
    },
    pre: {
      whiteSpace: 'pre-wrap',
    },
    fadedLine: {
      opacity: fadedOpacity,
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

const TrendChart: React.FC<Props> = ({ data, go, mode, codes, zoneColor, highlighted, setHighlight }) => {
  const classes = useStyles()
  const aspectRatio = window.innerWidth / window.innerHeight
  const view = useResponsiveView({
    marginTop: 5,
    marginLeft: 40,
    marginBottom: 30,
    marginRight: 5,
  })
  const threshold = 10
  function doublingRate(chart, index) {
    let i = index
    if (i < 0) i = Math.max(chart.length - i, 0)
    if (i > chart.length - 1) i = chart.length - 1
    const prev = chart[Math.max(i - 1, 0)]
    const next = chart[Math.min(i + 1, chart.length - 1)]
    const period = (next.dayCount - prev.dayCount) / (Math.log2(next.totInfSma5) - Math.log2(prev.totInfSma5))
    const periodFmt = period < 10 ? d3.format('.1f') : d3.format('.0f')
    const periodLabel = `doubling every ${periodFmt(period)} days`
    const periodShortLabel = `${periodFmt(period)} days`
    return {
      period,
      prev,
      next,
      periodFmt,
      periodLabel: window.innerWidth < 600 ? periodShortLabel : periodLabel,
      periodShortLabel,
    }
  }

  useEffect(() => {
    console.log('render trend chart', { data })
    const maybeDiv: unknown = view.ref.current
    if (!maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement
    const svg = d3.select(el).select('svg')
    const dot = svg.select('g.dot')
    const legendHeight = +d3.select(el).select('.legend').style('height').slice(0, -2)
    dot.attr('display', 'none')
    console.log('d3 update: trend chart', {
      legendHeight,
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
      .range([view.innerHeight, Math.max(view.marginTop, legendHeight)])
      .nice()
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(filteredZones.map((z) => z.chart.length)) + 20])
      .range([view.marginLeft, view.innerWidth])
      .nice()

    svg
      .select('.xAxis')
      .attr('transform', `translate(0, ${view.height - view.marginBottom})`)
      .call(d3.axisBottom(x).ticks(view.innerWidth / 70))
    svg
      .select('.yAxis')
      .attr('transform', `translate(${view.marginLeft},0)`)
      .call(d3.axisLeft(y).tickFormat((d) => y.tickFormat(4, d3.format('.1s'))(d)))

    const trendLine = d3
      .line()
      .x((d, i) => x(i))
      .y((d) => y(d.totInf))
    const updateTrendLine = (d) =>
      d
        .attr('d', (d) => trendLine(d.chart))
        .attr('stroke', (d) => zoneColor(d.code))
        .attr('stroke-width', 2)
        .attr('fill', 'none')
    const enterTrendLine = (d) => d.append('path').attr('class', 'line').call(updateTrendLine)

    const updateLineLabel = (d) =>
      d
        .text((d) => `${d.name} (${doublingRate(d.chart, -1).periodLabel})`)
        .attr('x', (d) => x(d.chart.length))
        .attr('y', (d) => y(d.chart[d.chart.length - 1].totInf))
    const enterLineLabel = (d) => d.append('text').attr('class', `line-label ${classes.lineLabel}`).call(updateLineLabel)

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
    svg.on('mouseenter', entered).on('mousemove', moved).on('mouseleave', left)

    function entered() {
      dot.attr('display', null)
    }

    function moved() {
      const xValue = Math.round(x.invert(d3.event.layerX))
      if (xValue < 0) return

      const zoneValue = (z) => z.chart[xValue].totInf
      const parseTime = d3.timeParse('%Y-%m-%d')
      const dtValue = (z) => parseTime(z.chart[xValue].dt)
      const distance = (z) => Math.abs(y(zoneValue(z)) - d3.event.layerY)

      const candidateZones = filteredZones.filter((z) => z.chart.length > xValue).filter((z) => distance(z) < 50)
      const closestZone = d3Array.least(candidateZones, (z) => distance(z))

      if (!closestZone) {
        left()
        return
      } else {
        entered()
      }

      svg
        .select('.lines')
        .selectAll('g')
        .filter((d) => d.code !== closestZone.code)
        .classed(classes.fadedLine, true)

      svg
        .select('.lines')
        .selectAll('g')
        .filter((d) => d.code === closestZone.code)
        .classed(classes.fadedLine, false)

      const { prev, next, periodLabel } = doublingRate(closestZone.chart, xValue)
      const countFmt = d3.format(',.0f')
      const dtFmt = d3.timeFormat('%d %b')
      const slope = (y(next.totInf) - y(prev.totInf)) / (x(next.dayCount) - x(prev.dayCount))
      const rot = (Math.atan(slope) * 180) / Math.PI
      dot.attr('transform', `translate(${x(xValue)}, ${y(zoneValue(closestZone))})`)
      dot.select('text.count').text(`${dtFmt(dtValue(closestZone))}: ${countFmt(zoneValue(closestZone))}`)
      dot.select('text.doubling-label').text(periodLabel)
      dot.select('path.slope').attr('transform', `rotate(${rot})`)
    }

    function left() {
      svg
        .select('.lines')
        .selectAll('g')
        .classed(classes.fadedLine, (d) => !highlighted[d.code])
      dot.attr('display', 'none')
    }

    left()

    return () => {
      console.log('d3 cleanup')
    }
  }, [
    classes.fadedLine,
    classes.lineLabel,
    data,
    highlighted,
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
      <div style={{ height: aspectRatio > 1 ? '400px' : '300px', position: 'relative' }}>
        <div ref={view.ref} className={classes.chartRoot}>
          <svg className={classes.svgRoot} preserveAspectRatio='xMidYMid meet' width={view.width} height={view.height}>
            <g className='lines' />
            <g className='xAxis' />
            <g className='yAxis' />
            <g className='lineLabels' />
            <g className='dot'>
              <circle r='2.5' />
              <text
                className='count'
                textAnchor='middle'
                fontFamily='monospace'
                y={-28}
                stroke='#fff'
                strokeWidth='2px'
                fill='black'
                paintOrder='stroke'
              ></text>
              <text
                className='doubling-label'
                textAnchor='middle'
                fontFamily='sans-serif'
                fontSize='11'
                y={-17}
                stroke='#fff'
                strokeWidth='1px'
                fill='black'
                paintOrder='stroke'
              ></text>
              <path className='slope' d='M-70,0L70,0' stroke='grey' strokeWidth={0.5} />
            </g>
          </svg>
          <div className={'legend'} style={{ position: 'absolute', top: '5px', left: '15px', width: '100%' }}>
            <Row between='xs'>
              <Col xs={12} md style={{ padding: '0' }}>
                <Row start='xs'>
                  <p style={{ fontWeight: 500 }}>Cumulative Infections - Doubling rates</p>
                </Row>
              </Col>
              <Col xs={12} md>
                <Row end='xs' style={{ paddingRight: '15px' }}>
                  {data?.zones.map((z) => (
                    <div key={z.code} className={classes.legendItem} style={{ cursor: 'pointer' }} onClick={() => setHighlight(z.code)}>
                      <div
                        className={classes.legendItemIcon}
                        style={{ backgroundColor: zoneColor(z.code), opacity: highlighted[z.code] ? 1 : fadedOpacity }}
                      />
                      <small>{z.name}</small>
                    </div>
                  ))}
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <Typography variant='body1' style={{ fontSize: '10.7px' }}>
        Doubling rates calculated based on the 5 day moving average of total infections. Source: covid19india.org, mohfw.gov.in and various
        state governments.
      </Typography>
    </>
  )
}

export default memo(TrendChart)
