// @ts-nocheck
import React, { useEffect, useMemo, useState, memo } from 'react'
import { createStyles, makeStyles } from '@material-ui/styles'
import * as d3 from 'd3'
import * as topojson from 'topojson'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'
import { MapDataT } from '../../types'
import useResponsiveView from '../../hooks/useResponsiveView'
import colorLegend from './colorLegend'
import ZoneCard from './ZoneCard'
import { Row, Col } from 'react-flexbox-grid'

import './Choropleth.css'

interface Props {
  map: MapDataT | null
  colorMap: {
    [code: string]: string
  }
  data: V2HomeRoot_data | null
  go: (target: UrlT) => void
  mode: string
  dateRange: DateRangeT
  logScale: boolean
}
interface TooltipRowT {
  name: string
  pop: string
  yr: string
  ipm: number
  fpm: number
  i: number
  f: number
}

interface TooltipT {
  debug?: {
    [key: string]: string
  }
  rows: TooltipRowT[]
}

declare global {
  interface Window {
    choropleth: any
  }
}

window.choropleth = window.choropleth || { topojson, d3 }

const useStyles = makeStyles(() =>
  createStyles({
    mapRoot: {
      height: 'calc(100vh - 300px)',
      maxHeight: 'calc(100vh - 300px)',
      minHeight: '400px',
      minWidth: '400px',
      position: 'relative',
    },
    svgRoot: {
      border: '1px solid #eee',
    },
    colorLegend: {
      fontSize: '55%',
    },
    legendShape: {
      border: '2px solid #999',
    },
    pre: {
      whiteSpace: 'pre-wrap',
      maxWidth: '300px',
      overflow: 'scroll',
    },
    districtPath: {
      strokeWidth: 0.2,
      stroke: '#eee',
      opacity: 0.1,
    },
    statePath: {
      strokeWidth: 0.3,
      stroke: '#333',
      fill: 'transparent',
    },
    activePath: {
      strokeWidth: 1,
      stroke: '#666',
    },
    selectedDistrictPath: {
      opacity: 1,
    },
    gutter: {
      fill: 'white',
    },
    hoveredDistrict: {
      cursor: 'pointer',
      opacity: 1,
      strokeWidth: 1,
      stroke: '#666',
    },
    tooltip: {
      position: 'absolute',
      background: 'white',
      zIndex: '15',
      overflow: 'hidden',
      pointerEvents: 'none',
    },
  })
)
const colors = {
  palette: ['#fffcf9', '#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704', '#641A2C'],
}
const thresholds = [3, 5, 10, 20, 40, 60, 80, 100, 250, 1000]

const Choropleth: React.FC<Props> = ({ map, data, go, mode, dateRange, logScale, colorMap }) => {
  const classes = useStyles()
  const view = useResponsiveView({ marginTop: 70, marginLeft: 25, marginBottom: 25, marginRight: 25 })
  const color = useMemo(() => d3.scaleThreshold().domain(thresholds).range(colors.palette), [])
  const colorHex = color
  const colorConst = (count: number): string => '#eeeeee'
  const [tooltip, setTooltip] = useState<TooltipT>(null)

  useEffect(() => {
    console.log('render choropleth', { map, data })
    const maybeDiv: unknown = view.ref.current
    if (!maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement
    const svg = d3.select(el).select('svg')
    console.log('d3 update', svg)

    const onClick = function (d) {
      const code = d.properties.z.replace(/\/$/, '')
      go({ codes: mode === 'compare' ? [code, ...zones.map((z) => z.code)] : [code] })
    }
    const gLegend = svg.select('.colorLegend')
    gLegend
      .call(colorLegend, {
        color: color,
        title: 'Infections per million population',
        width: 320,
      })
      .attr('transform', `translate(${view.innerWidth - 340},20)`)

    const gMask = svg.select('.mask')
    gMask
      .selectAll('rect')
      .data(
        [
          [0, 0, view.width, view.marginTop],
          [view.width - view.marginRight, 0, view.marginRight, view.height],
          [0, view.height - view.marginBottom, view.width, view.marginBottom],
          [0, 0, view.marginLeft, view.height],
        ],
        (d, i) => i
      )
      .join('rect')
      .attr('x', (d) => d[0])
      .attr('y', (d) => d[1])
      .attr('width', (d) => d[2])
      .attr('height', (d) => d[3])
      .classed(classes.gutter, true)

    if (!map) return
    const mapData = map['map']
    const t = d3.transition().duration(1000)
    const districtTopo = topojson.feature(mapData, mapData.objects.districts) || { features: [] }
    const stateTopo = topojson.feature(mapData, mapData.objects.states) || { features: [] }
    const selectedZoneCodes = (data ? [...data.zones.flatMap((z) => z.unitCodes), ...data.zones.map((z) => z.code)] : ['in']).map(
      (code) => `${code}/`
    )
    const selectedStateTopo = {
      ...stateTopo,
      features: stateTopo.features.filter(
        (d) =>
          d.properties.z.length >= 2 &&
          selectedZoneCodes.some((code) => (code.length >= 2 && d.properties.z.startsWith(code)) || code.startsWith(d.properties.z))
      ),
    }
    const selectedDistrictTopo = {
      ...districtTopo,
      features: districtTopo.features.filter(
        (d) =>
          d.properties.z.length >= 2 &&
          selectedZoneCodes.some((code) => (code.length >= 2 && d.properties.z.startsWith(code)) || code.startsWith(d.properties.z))
      ),
    }

    const selectedDistrictCodes = selectedDistrictTopo.features.map((d) => d.properties.z)
    const selectedStateCodes = selectedStateTopo.features.map((d) => d.properties.z)

    const divTooltip = d3.select(el).select('.tooltip')
    const showTooltip = function (d) {
      const props = [d.properties]
      moveTooltip(d)
      d3.select(this).classed(classes.hoveredDistrict, true).raise()
      setTooltip({
        rows: props,
      })
    }
    const moveTooltip = (d) => {
      const m = d3.mouse(el)
      divTooltip
        .style('left', `${m[0]}px`)
        .style('top', `${m[1]}px`)
        .style('transform', m[0] > view.width / 2 ? `translate(-100%)` : null)
    }

    const hideTooltip = function (d) {
      d3.select(this).classed(classes.hoveredDistrict, false).lower()
      setTooltip(null)
    }

    const projection = d3.geoMercator()
    const path = d3.geoPath(projection)
    projection.fitExtent(
      [
        [0, 0],
        [view.width, view.height],
      ],
      districtTopo
    )
    const box = d3.geoPath(projection).bounds(selectedStateTopo)
    const zoom = Math.min(view.innerWidth / (box[1][0] - box[0][0]), view.innerHeight / (box[1][1] - box[0][1]))
    const dx = ((box[0][0] + box[1][0]) / 2) * zoom - view.innerWidth / 2
    const dy = ((box[0][1] + box[1][1]) / 2) * zoom - view.innerHeight / 2
    const gDistricts = svg.select('.districts')
    gDistricts.transition(t).attr('transform', `translate(${view.marginLeft - dx}, ${view.marginTop - dy})scale(${zoom})`)

    gDistricts
      .selectAll('path')
      .data(districtTopo.features, (d) => d.properties.u)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', path)
            .style('fill', (d, i) => color(0))
            .call((enter) => enter.style('fill', (d, i) => color(d.properties.ipm)))
            .classed(classes.districtPath, true)
            .classed(classes.activePath, (d) => selectedZoneCodes.includes(d.properties.z))
            .classed(classes.selectedDistrictPath, (d) => selectedDistrictCodes.includes(d.properties.z))
            .on('mouseover', showTooltip)
            .on('mousemove', moveTooltip)
            .on('mouseout', hideTooltip)
            .on('click', onClick),
        (update) =>
          update
            .classed(classes.districtPath, true)
            .classed(classes.activePath, (d) => selectedZoneCodes.includes(d.properties.z))
            .classed(classes.selectedDistrictPath, (d) => selectedDistrictCodes.includes(d.properties.z)),
        (exit) => exit.call((exit) => exit.transition(t).attr('opacity', 0).remove())
      )

    const gStates = svg.select('.states')
    gStates.transition(t).attr('transform', `translate(${view.marginLeft - dx}, ${view.marginTop - dy})scale(${zoom})`)
    gStates
      .selectAll('path')
      .data(stateTopo.features, (d) => d.properties.z)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', path)
            .raise()
            .classed(classes.statePath, true)
            .classed(classes.activePath, (d) => selectedZoneCodes.includes(d.properties.z)),
        (update) => update.classed(classes.statePath, true).classed(classes.activePath, (d) => selectedZoneCodes.includes(d.properties.z)),
        (exit) => exit.call((exit) => exit.transition(t).attr('opacity', 0).remove())
      )
    return () => {
      console.log('d3 cleanup')
    }
  }, [
    classes.activePath,
    classes.districtPath,
    classes.gutter,
    classes.hoveredDistrict,
    classes.selectedDistrictPath,
    classes.statePath,
    color,
    data,
    go,
    map,
    mode,
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
      <Row start='xs'>
        {data &&
          data.zones.map((zone) => (
            <Col className='fade' xs={6} sm={4} md={3} lg={2} key={zone.code}>
              <ZoneCard lineColor={colorMap[zone.code]} ipmColor={colorHex} iColor={colorConst} zone={zone} />
            </Col>
          ))}
      </Row>

      <div ref={view.ref} className={classes.mapRoot}>
        <div className={`${classes.tooltip} tooltip`} style={{ display: tooltip ? 'block' : 'none' }}>
          <table>
            <tbody>
              {tooltip &&
                tooltip.rows.map((row) => (
                  <React.Fragment key={row.name}>
                    <tr>
                      <td colSpan={4}>
                        {row.name} Pop: {row.pop} ({row.yr})
                      </td>
                    </tr>
                    <tr>
                      <td>{row.i}</td>
                      <td>Infections</td>
                      <td>{row.ipm}</td>
                      <td>infections per million</td>
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
        <svg className={classes.svgRoot} preserveAspectRatio='xMidYMid meet' width={view.width} height={view.height}>
          <g className='districts' />
          <g className='states' style={{ pointerEvents: 'none' }} />
          <g className='mask' />
          <g className='colorLegend' />
        </svg>
        <pre className={classes.pre}>
          {view.width} x {view.height}
          {JSON.stringify(data, null, null)}
        </pre>
      </div>
    </>
  )
}

export default memo(Choropleth)
