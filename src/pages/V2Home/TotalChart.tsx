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
      minWidth: '400px',
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

    const parseTime = d3.timeParse('%Y-%m-%d')
    const parseDt = (dt: string): Date => parseTime(dt) || new Date()
    const minDate = d3.min(filteredZones.flatMap((zone) => zone.chart.map((point) => parseDt(point.dt)))) || new Date('2020', 3, 1)
    const maxDate = d3.max(filteredZones.flatMap((zone) => zone.chart.map((point) => parseDt(point.dt)))) || new Date()

    const minValue = d3.min(filteredZones.flatMap((zone) => zone.chart.map((point) => point.newInf))) || 0
    const maxValue = d3.max(filteredZones.flatMap((zone) => zone.chart.map((point) => point.newInf))) || 100

    const y = d3
      .scaleLog()
      .domain([Math.max(minValue, 1), maxValue])
      .range([view.innerHeight, Math.max(view.marginTop, legendHeight)])
      .nice()
    const x = d3.scaleTime().domain([minDate, maxDate]).range([view.marginLeft, view.innerWidth]).nice()
    const tickCount = Math.ceil(view.innerWidth / 70)

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
  ])

  return (
    <>
      <div style={{ height: '400px', position: 'relative' }}>
        <div ref={view.ref} className={classes.chartRoot}>
          <svg className={classes.svgRoot} preserveAspectRatio='xMidYMid meet' width={view.width} height={view.height}>
            <g className='lines' />
            <g className={`xAxisGrid ${classes.grid}`} />
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
                <Row start='xs md'>
                  <p style={{ fontWeight: 500 }}>{`Total infections - ${
                    mode === 'compare' ? '5 day average' : data?.zones[0]?.name || ''
                  }`}</p>
                </Row>
              </Col>
              <Col xs={12} md>
                <Row end='xs md' style={{ paddingRight: '15px' }}>
                  {data?.zones.map((z) => (
                    <div
                      key={z.code}
                      className={classes.legendItem}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHighlight(z.code)}
                      onClick={() => setHighlight(z.code)}
                    >
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
        Source: covid19india.org, mohfw.gov.in and various state governments.
      </Typography>
    </>
  )
}

export default memo(DailyChart)
