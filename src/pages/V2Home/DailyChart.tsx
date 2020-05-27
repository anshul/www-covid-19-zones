// @ts-nocheck
import { Typography, Theme, createStyles, makeStyles } from '@material-ui/core'
import * as d3 from 'd3'
import React, { memo, useEffect } from 'react'
import useResponsiveView from '../../hooks/useResponsiveView'
import { DateRangeT, UrlT } from '../../types'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'
import { Col, Row } from 'react-flexbox-grid'

interface Props {
  zoneColor: d3.ScaleOrdinal<string, string>
  data: V2HomeRoot_data | null
  codes: string[]
  go: (target: UrlT) => void
  mode: string
  dateRange: DateRangeT
  isLogarithmic: boolean
  highlighted: { [key: string]: boolean | undefined | null }
  setHighlight: (key: string) => void
}

const fadedOpacity = 0.2
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
    grid: {
      color: '#aaa',
      opacity: 0.5,
      '& line': {
        stroke: '#aaa',
        shapeRendering: 'crispEdges',
        opacity: 0.4,
      },
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

const DailyChart: React.FC<Props> = ({ data, go, mode, codes, zoneColor, highlighted, setHighlight }) => {
  const classes = useStyles()
  const aspectRatio = window.innerWidth / window.innerHeight
  const view = useResponsiveView({
    marginTop: 5,
    marginLeft: 40,
    marginBottom: 30,
    marginRight: 5,
  })
  useEffect(() => {
    console.log('render trend chart', { data })
    const maybeDiv: unknown = view.ref.current
    if (!maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement
    const svg = d3.select(el).select('svg')
    const dot = svg.select('g.dot')
    const barsContainer = svg.select('.bars')
    const legendHeight = +d3.select(el).select('.legend').style('height').slice(0, -2)
    dot.attr('display', 'none')
    console.log('d3 update: daily chart', {
      legendHeight,
      w: view.width,
      h: view.height,
      iw: view.innerWidth,
      ih: view.innerHeight,
      m: [view.marginTop, view.marginRight, view.marginBottom, view.marginLeft],
    })

    if (!data) return

    const filteredZones = data.zones.filter((z) => z.chart && z.chart.length >= 1)
    const zone = filteredZones.find((z) => highlighted[z.code] === true) || filteredZones[0]
    if (!zone) return

    const parseDate = d3.timeParse('%Y-%m-%d')
    const dateFmt = d3.timeFormat('%Y-%m-%d')
    const minDate = d3.min(filteredZones.flatMap((zone) => zone.chart.map((point) => parseDate(point.dt)))) || new Date('2020', 3, 1)
    const maxDate = d3.max(filteredZones.flatMap((zone) => zone.chart.map((point) => parseDate(point.dt)))) || new Date()

    const minValue = d3.min(filteredZones.flatMap((zone) => zone.chart.map((point) => point.newInf))) || 0
    const maxValue = d3.max(filteredZones.flatMap((zone) => zone.chart.map((point) => point.newInf))) || 100

    const barWidth = 4
    const tipRadius = 3

    const y = d3
      .scaleLinear()
      .domain([Math.max(minValue, 1), maxValue])
      .range([view.innerHeight, Math.max(view.marginTop, legendHeight)])
      .nice()
    const x = d3.scaleTime().domain([minDate, maxDate]).range([view.marginLeft, view.innerWidth]).nice()
    const tickCount = Math.ceil(view.innerWidth / 90)

    svg
      .select('.xAxisGrid')
      .attr('transform', `translate(0, ${view.height - view.marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(tickCount)
          .tickSize(-view.innerHeight + legendHeight)
          .tickFormat('')
      )

    const updateStem = (selection) => selection.attr('height', (d) => view.innerHeight - y(d.newInf)).attr('fill', zoneColor(zone.code))
    const enterStem = (selection) => selection.append('rect').attr('width', barWidth).call(updateStem)

    const updateTip = (selection) => selection.attr('fill', zoneColor(zone.code))
    const enterTip = (selection) =>
      selection
        .append('circle')
        .attr('r', tipRadius)
        .attr('cx', barWidth / 2)
        .call(updateTip)

    barsContainer
      .selectAll('g')
      .data(zone.chart, (d) => d.dt)
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('id', (d) => `day-${d.dt}`)
            .attr('transform', (d) => `translate(${x(parseDate(d.dt)) - barWidth / 2}, ${y(d.newInf)})`)
            .call(enterStem)
            .call(enterTip),
        (update) =>
          update
            .attr('transform', (d) => `translate(${x(parseDate(d.dt)) - barWidth / 2}, ${y(d.newInf)})`)
            .call((g) => g.select('rect').call(updateStem))
            .call((g) => g.select('circle').call(updateTip)),
        (exit) => exit.remove()
      )

    const entered = () => {
      barsContainer.selectAll('g').attr('opacity', 0.75).select('circle').attr('r', tipRadius)
    }

    const moved = () => {
      const date = dateFmt(x.invert(d3.event.layerX))

      const hoveredBar = barsContainer.select(`#day-${date}`)
      if (hoveredBar.empty()) {
        left()
      } else {
        entered()
        hoveredBar
          .attr('opacity', 1)
          .select('circle')
          .attr('r', tipRadius * 1.25)
      }
    }

    const left = () => {
      barsContainer.selectAll('g').attr('opacity', 1).select('circle').attr('r', tipRadius)
    }

    svg.on('mouseenter', entered)
    svg.on('mousemove', moved)
    svg.on('mouseleave', left)

    svg
      .select('.xAxis')
      .attr('transform', `translate(0, ${view.height - view.marginBottom})`)
      .call(d3.axisBottom(x).ticks(tickCount))
    svg
      .select('.yAxis')
      .attr('transform', `translate(${view.marginLeft},0)`)
      .call(d3.axisLeft(y).tickFormat((d) => y.tickFormat(4, d3.format('.1s'))(d)))

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
    highlighted,
  ])

  return (
    <>
      <div style={{ height: aspectRatio > 1 ? '400px' : '300px', position: 'relative' }}>
        <div ref={view.ref} className={classes.chartRoot}>
          <svg className={classes.svgRoot} preserveAspectRatio='xMidYMid meet' width={view.width} height={view.height}>
            <g className='bars' />
            <g className={`xAxisGrid ${classes.grid}`} />
            <g className='xAxis' />
            <g className='yAxis' />
            <g className='dot'>
              <circle r='2.5' />
            </g>
          </svg>
          <div className={'legend'} style={{ position: 'absolute', top: '5px', left: '15px', width: '100%' }}>
            <Row between='xs'>
              <Col xs={12} md style={{ padding: '0' }}>
                <Row start='xs'>
                  <p style={{ fontWeight: 500 }}>{`Infections by day - ${
                    mode === 'compare' ? '5 day average' : data?.zones[0]?.name || ''
                  }`}</p>
                </Row>
              </Col>
              <Col xs={12} md>
                <Row end='xs' style={{ paddingRight: '15px' }}>
                  {data?.zones.map((z) => (
                    <div key={z.code} className={classes.legendItem} style={{ cursor: 'pointer' }} onClick={() => setHighlight(z.code)}>
                      <div
                        className={classes.legendItemIcon}
                        style={{ backgroundColor: zoneColor(z.code), opacity: highlighted[z.code] ? 1 : fadedOpacity }}
                        title={`click for daily values of ${z.name}`}
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
        Source: covid19india.org, mohfw.gov.in and various state governments.
      </Typography>
    </>
  )
}

export default memo(DailyChart)
