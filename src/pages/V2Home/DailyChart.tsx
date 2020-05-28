// @ts-nocheck
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import * as d3 from 'd3'
import React, { memo, useEffect, useState } from 'react'
import { Col, Row } from 'react-flexbox-grid'
import useResponsiveView from '../../hooks/useResponsiveView'
import { ChartOptionsT, UrlT } from '../../types'
import { filterData } from '../../utils/filterData'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'
import ChartOptionsRow from './ChartOptionsRow'

interface Props {
  zoneColor: d3.ScaleOrdinal<string, string>
  zoneSecondaryColor: d3.ScaleOrdinal<string, string>
  data: V2HomeRoot_data | null
  codes: string[]
  go: (target: UrlT) => void
  mode: string
  chartOptions: ChartOptionsT
  highlighted: { [key: string]: boolean | undefined | null }
  setHighlight: (key: string) => void
}

const fadedOpacity = 0.2
const inactiveBarOpacity = 0.3
const activeBarOpacity = 0.75
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
    tooltipContent: {
      pointerEvents: 'none',
      width: 'fit-content',
      position: 'absolute',
      padding: '8px 16px',
      backgroundColor: 'white',
      borderRadius: theme.spacing(0.5),
      boxShadow: '0 10px 24px 0 rgba(0,0,0, 0.12)',
      // transitionDuration: '40ms',
      // transitionTimingFunction: 'ease',
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
  })
)

const DailyChart: React.FC<Props> = ({ data, go, mode, codes, chartOptions, zoneColor, zoneSecondaryColor, highlighted, setHighlight }) => {
  const classes = useStyles()
  const [tooltip, setTooltip] = useState<{
    title: string
    items: {
      color: string
      name: string
      value: string
    }[]
  }>(null)
  const aspectRatio = window.innerWidth / window.innerHeight
  const view = useResponsiveView({
    marginTop: 5,
    marginLeft: 50,
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
    // const tipsContainer = svg.select('.tips')
    const tooltip = d3.select(el).select('.daily-tooltip')
    const guideContainer = svg.select('.guideContainer')
    const legendHeight = +d3.select(el).select('.legend').style('height').slice(0, -2)
    d3.select(el)
      .select('.legend2')
      .style('top', `${legendHeight - 10}px`)
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

    const filteredZones = data.zones
      .filter((z) => z.chart && z.chart.length >= 1)
      .map((z) => ({ ...z, chart: filterData(chartOptions.dateRange, z.chart) }))
    const zone = filteredZones.find((z) => highlighted[z.code] === true) || filteredZones[0]
    if (!zone) return

    const parseDate = d3.timeParse('%Y-%m-%d')
    const dateFmt = d3.timeFormat('%Y-%m-%d')
    const minDate = d3.min(filteredZones.flatMap((zone) => zone.chart.map((point) => parseDate(point.dt)))) || new Date('2020', 3, 1)
    const maxDate = d3.max(filteredZones.flatMap((zone) => zone.chart.map((point) => parseDate(point.dt)))) || new Date()

    const minValue = Math.max(0, d3.min(filteredZones.flatMap((zone) => zone.chart.map((point) => point.newInf))) || 0)
    const maxValue = d3.max(filteredZones.flatMap((zone) => zone.chart.map((point) => point.newInf))) || 100

    const yScale = chartOptions.isLogarithmic
      ? d3.scaleLog().domain([Math.max(1, minValue), maxValue])
      : d3.scaleLinear().domain([minValue, maxValue])
    const effectiveTop = Math.max(view.marginTop, legendHeight)
    const y = yScale
      .range([view.height - view.marginBottom, effectiveTop])
      .clamp(true)
      .nice()
    const x = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([view.marginLeft, view.marginLeft + view.innerWidth])
      .nice()
    const tickCount = Math.ceil(view.innerWidth / 90)

    const xBand = d3.scaleBand().domain(d3.timeDay.range(minDate, maxDate)).range([view.marginLeft, view.innerWidth])

    const barWidth = Math.min(xBand.bandwidth() / 2, 3)
    const tipRadius = Math.min(3, barWidth * 1.2)
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

    const line = d3
      .line()
      .x((d) => x(parseDate(d.dt)))
      .y((d) => y(d.newInfSma5))

    svg
      .select('.lines')
      .selectAll('path')
      .data(filteredZones, (d) => d.code)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', (d) => line(d.chart))
            .attr('fill', 'none')
            .attr('stroke', (d) => zoneSecondaryColor(d.code))
            .attr('stroke-width', 3),
        (update) => update.attr('d', (d) => line(d.chart)).attr('stroke', (d) => zoneSecondaryColor(d.code)),
        (exit) => exit.remove()
      )

    guideContainer
      .selectAll('circle')
      .data(filteredZones, (d) => d.code)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('r', 3)
            .attr('fill', '#e39548')
            .attr('stroke-width', 8)
            .attr('stroke', 'white')
            .attr('paint-order', 'stroke'),
        (update) => update,
        (exit) => exit.remove()
      )

    const yMin = y.domain()[0]
    const xMin = x.domain()[0]
    const updateStem = (selection) =>
      selection
        .transition()
        .duration(1000)
        .attr('fill', zoneColor(zone.code))
        .attr('x', (d) => x(parseDate(d.dt)) - barWidth / 2)
        .attr('y', (d) => y(d.newInf))
        .attr('width', (d) => barWidth)
        .attr('height', (d) => Math.max(y(yMin) - y(d.newInf), 0))
    const updateTip = (selection) =>
      selection
        .transition()
        .duration(1000)
        .attr('fill', zoneColor(zone.code))
        .attr('cx', (d) => x(parseDate(d.dt)))
        .attr('cy', (d) => y(d.newInf))
        .attr('r', (d) => tipRadius)

    barsContainer
      .selectAll('rect')
      .data(zone.chart, (d) => d.dt)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('opacity', inactiveBarOpacity)
            .attr('id', (d) => `day-${d.dt}`)
            .attr('x', (d) => x(xMin))
            .attr('y', (d) => y(yMin))
            .call(updateStem),
        (update) => update.call(updateStem),
        (exit) => exit.remove()
      )

    barsContainer
      .selectAll('circle')
      .data(zone.chart, (d) => d.dt)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('opacity', inactiveBarOpacity)
            .attr('cx', (d) => x(xMin))
            .attr('cy', (d) => y(yMin))
            .attr('r', 0)
            .call(updateTip),
        (update) => update.call(updateTip),
        (exit) => exit.remove()
      )

    const entered = () => {
      const date = dateFmt(x.invert(d3.event.layerX))
      const mouse = d3.mouse(el)

      setTooltip({
        title: date.toString(),
        items: filteredZones.map((zone) => {
          return { name: zone.name, color: zoneColor(zone.code), value: zone.chart.find((d) => d.dt === date)?.newInfSma5 }
        }),
      })

      tooltip.style('left', `${mouse[0] + 20}px`)
      tooltip.style('top', `${mouse[1] + 5}px`)
      barsContainer.selectAll('rect').attr('opacity', inactiveBarOpacity).select('circle').attr('r', tipRadius)
      guideContainer.selectAll('circle').attr('display', null)
    }

    const moved = () => {
      const date = dateFmt(x.invert(d3.event.layerX))
      const mouse = d3.mouse(el)

      setTooltip({
        title: date.toString(),
        items: filteredZones.map((zone) => {
          return { name: zone.name, color: zoneColor(zone.code), value: zone.chart.find((d) => d.dt === date)?.newInfSma5 }
        }),
      })

      tooltip.style('left', `${mouse[0] + 20}px`)
      tooltip.style('top', `${mouse[1] + 5}px`)

      const hoveredBar = barsContainer.select(`#day-${date}`)
      if (hoveredBar.empty()) {
        left()
      } else {
        entered()
        hoveredBar
          .attr('opacity', activeBarOpacity)
          .select('circle')
          .attr('r', tipRadius * 1.25)
      }
      guideContainer.selectAll('circle').attr(`transform`, (zone) => {
        const day = zone.chart.find((d) => d.dt === date)
        return `translate(${x(parseDate(date))}, ${y(day?.newInfSma5 || 0)})`
      })
    }

    const left = () => {
      setTooltip(null)
      barsContainer.selectAll('rect').attr('opacity', inactiveBarOpacity).select('circle').attr('r', tipRadius)
      guideContainer.selectAll('circle').attr('display', 'none')
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
      .attr('transform', `translate(${view.marginLeft - 5},0)`)
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
    chartOptions,
    zoneSecondaryColor,
  ])

  return (
    <>
      <div style={{ height: aspectRatio > 1 ? '400px' : '300px', position: 'relative' }}>
        <div ref={view.ref} className={classes.chartRoot}>
          <div key='tooltip' className={`daily-tooltip ${classes.tooltipContent}`} style={{ display: tooltip ? 'block' : 'none' }}>
            {tooltip && (
              <>
                <h5 className={classes.tootipTitle}>
                  <strong>{tooltip.title}</strong>
                </h5>
                {tooltip.items.map((item) => (
                  <div key={item.title} className={classes.tooltipItemContainer}>
                    <div className={classes.tooltipItemIcon} style={{ backgroundColor: item.color }} />
                    <small>
                      {item.value} {item.name}
                    </small>
                  </div>
                ))}
              </>
            )}
          </div>
          <svg className={classes.svgRoot} preserveAspectRatio='xMidYMid meet' width={view.width} height={view.height}>
            <g className='bars' />
            <g className='tips' />
            <g className='lines' />
            <g className='guideContainer'>
              <path className='guideLine' />
            </g>
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
          <div className={'legend2'} style={{ position: 'absolute', top: '70px', left: '40px', width: '100%' }}>
            <ChartOptionsRow options={chartOptions} />
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
