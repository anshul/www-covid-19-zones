// @ts-nocheck
import React, { memo, useEffect, useState } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson'
import { createStyles, makeStyles } from '@material-ui/core'
import useResponsiveView from '../../hooks/useResponsiveView'
import { MapDataT } from '../../types'
import NumberPill from './NumberPill'

interface ZoneT {
  readonly code: string
  readonly unitCodes: readonly string[]
}

interface Props {
  readonly titleCode: string
  readonly title: string
  map: MapDataT | null
  zoneColor: d3.ScaleOrdinal<string, string>
  ipmColor: d3.ScaleThreshold<number, string>
  iColor: d3.ScaleThreshold<number, string>
  zones: readonly ZoneT[] | null
  codes: string[]
  go: (target: UrlT) => void
  mode: string
  dateRange: DateRangeT
  isLogarithmic: boolean
  isTouchDevice: boolean
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

const useStyles = makeStyles(() =>
  createStyles({
    mapRoot: {
      height: '100%',
      minHeight: '160px',
      minWidth: '160px',
      position: 'relative',
    },
    separator: {
      borderTop: '1px solid black',
      borderLeft: '1px solid black',
      padding: '5px',
    },
    term: {
      fontSize: '80%',
      fontWeight: '600',
    },
    svgRoot: {
      border: '1px solid #eee',
    },
    districtPath: {
      strokeWidth: 0.2,
      stroke: '#eee',
      opacity: 0.15,
    },
    statePath: {
      strokeWidth: 0.3,
      stroke: '#333',
      fill: 'transparent',
    },
    activePath: {
      strokeWidth: 0.7,
      stroke: '#666',
    },
    selectedDistrictPath: {
      opacity: 1,
    },
    gutter: {
      fill: 'white',
    },
    hoveredState: {
      cursor: 'pointer',
      opacity: 1,
      strokeWidth: 2,
      stroke: '#666',
    },
    hoveredDistrict: {
      cursor: 'pointer',
      opacity: 1,
      strokeWidth: 0.7,
      stroke: '#666',
    },
    tooltip: {
      position: 'absolute',
      zIndex: '15',
      overflow: 'hidden',
      pointerEvents: 'none',
      border: '1px solid #c4c4c4',
      backgroundColor: 'white',
      padding: '.25em .5em .5em',
      borderRadius: '.25em',
      fontSize: '80%',
    },
  })
)

const Choropleth: React.FC<Props> = ({
  titleCode,
  map,
  zones,
  go,
  mode,
  codes,
  dateRange,
  isLogarithmic,
  zoneColor,
  ipmColor,
  iColor,
  isTouchDevice,
}) => {
  const classes = useStyles()
  const view = useResponsiveView({ marginTop: 5, marginLeft: 5, marginBottom: 5, marginRight: 5 })
  const [tooltip, setTooltip] = useState<TooltipT>(null)

  useEffect(() => {
    const currentlyOnCountry = titleCode === 'in'
    console.log('render choropleth', { currentlyOnCountry, map, zones })
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

    const onClick = function (d) {
      const code = d.properties.z.replace(/\/$/, '')
      // const parentCode = d.properties.pz.replace(/\/$/, '')
      go({ codes: mode === 'compare' ? [...codes, code] : [code] })
    }
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
      .attr('x', (d) => d[0] - 1)
      .attr('y', (d) => d[1] - 1)
      .attr('width', (d) => Math.max(d[2] + 2, 0))
      .attr('height', (d) => Math.max(d[3] + 2, 0))
      .classed(classes.gutter, true)

    if (!map) return
    const mapData = map['map']
    const districtTopo = topojson.feature(mapData, mapData.objects.districts) || { features: [] }
    const stateTopo = topojson.feature(mapData, mapData.objects.states) || { features: [] }
    const selectedZoneCodes = (zones ? [...zones.flatMap((z) => z.unitCodes), ...zones.map((z) => z.code)] : ['in']).map((code) => `${code}/`)
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
    // const selectedStateCodes = selectedStateTopo.features.map((d) => d.properties.z)

    const divTooltip = d3.select(el).select('.tooltip')
    const showTooltip = function (d) {
      const features = [d, stateTopo.features.find((s) => s.properties.z === d.properties.pz)].filter((x) => x)
      moveTooltip(d)
      currentlyOnCountry ? d3.select(this).classed(classes.hoveredState, true) : d3.select(this).classed(classes.hoveredDistrict, true).raise()
      setTooltip({
        rows: features.map((f) => f.properties),
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
      currentlyOnCountry
        ? d3.select(this).classed(classes.hoveredState, false)
        : d3.select(this).classed(classes.hoveredDistrict, false).lower()
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
    const [[x0, y0], [x1, y1]] = d3.geoPath(projection).bounds(selectedStateTopo)
    const [w, h] = [x1 - x0, y1 - y0]
    const zoom0 = Math.min(view.innerWidth / w, view.innerHeight / h) || 1

    const [boxX, boxY] = [(x0 + x1) / 2, (y0 + y1) / 2]
    const [spaceX, spaceY] = [(view.innerWidth - zoom0 * w) / 2, (view.innerHeight - zoom0 * h) / 2]
    const [minSpaceX, minSpaceY] = [200, 180]
    const extraX = spaceX >= spaceY && spaceX < minSpaceX ? minSpaceX - spaceX : 2
    const extraY = spaceY > spaceX && spaceY < minSpaceY ? minSpaceY - spaceY : 2
    console.log(555555555, extraX, extraY)
    const [viewX, viewY] = [view.marginLeft + extraX / 2 + view.innerWidth / 2, view.marginTop + extraY / 2 + view.innerHeight / 2]
    const zoom = Math.min((view.innerWidth - extraX) / w, (view.innerHeight - extraY) / h, 12) || 1
    const [dx, dy] = [viewX - boxX * zoom || 0, viewY - boxY * zoom || 0]
    const gDistricts = svg.select('.districts')
    const transitionZoom = (selection) =>
      mode === 'compare'
        ? selection.attr('transform', `translate(${dx}, ${dy})scale(${zoom})`)
        : selection.transition().duration(1000).attr('transform', `translate(${dx}, ${dy})scale(${zoom})`)
    const events = (selection, hasEvents) => {
      if (!hasEvents) return selection
      return isTouchDevice
        ? selection.on('click', onClick)
        : selection.on('mouseover', showTooltip).on('mousemove', moveTooltip).on('mouseout', hideTooltip).on('click', onClick)
    }

    const districtUpdater = (update) =>
      update
        .classed(classes.districtPath, true)
        .classed(classes.activePath, (d) => selectedZoneCodes.includes(d.properties.z))
        .classed(classes.selectedDistrictPath, (d) => selectedDistrictCodes.includes(d.properties.z))
        .call(events, !currentlyOnCountry)
    const filterCode = titleCode + '/'
    const filterFeatures = (d) => d.properties.z === filterCode || d.properties.pz === filterCode || titleCode === 'in'
    gDistricts
      .style('pointer-events', currentlyOnCountry ? 'none' : 'all')
      .call(transitionZoom)
      .selectAll('path')
      .data(districtTopo.features.filter(filterFeatures), (d) => d.properties.u)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', path)
            .style('fill', (d, i) => ipmColor(0))
            .call((enter) => enter.style('fill', (d, i) => ipmColor(d.properties.ipm)))
            .call(districtUpdater),
        (update) => update.attr('d', path).call(districtUpdater),
        (exit) => exit.call((exit) => (isTouchDevice ? exit.remove() : exit.transition().duration(1000).attr('opacity', 0).remove()))
      )

    const stateUpdater = (selection) =>
      selection
        .classed(classes.statePath, true)
        .classed(classes.activePath, (d) => selectedZoneCodes.includes(d.properties.z))
        .call(events, currentlyOnCountry)

    const gStates = svg.select('.states')
    gStates
      .style('pointer-events', currentlyOnCountry ? 'all' : 'none')
      .call(transitionZoom)
      .selectAll('path')
      .data(stateTopo.features.filter(filterFeatures), (d) => d.properties.z)
      .join(
        (enter) => enter.append('path').attr('d', path).raise().call(stateUpdater),
        (update) => update.attr('d', path).call(stateUpdater),
        (exit) => exit.call((exit) => (isTouchDevice ? exit.remove() : exit.transition().duration(1000).attr('opacity', 0).remove()))
      )
    return () => {
      console.log('d3 cleanup')
    }
  }, [
    classes.activePath,
    classes.districtPath,
    classes.gutter,
    classes.hoveredDistrict,
    classes.hoveredState,
    classes.selectedDistrictPath,
    classes.statePath,
    codes,
    go,
    ipmColor,
    isTouchDevice,
    map,
    mode,
    titleCode,
    view.height,
    view.innerHeight,
    view.innerWidth,
    view.marginBottom,
    view.marginLeft,
    view.marginRight,
    view.marginTop,
    view.ref,
    view.width,
    zones,
  ])

  return (
    <>
      <div ref={view.ref} className={classes.mapRoot}>
        <div className={`${classes.tooltip} tooltip`} style={{ display: tooltip ? 'block' : 'none' }}>
          <table style={{ tableLayout: 'fixed', width: '240px' }}>
            <tbody>
              {tooltip &&
                tooltip.rows.map((row) => (
                  <React.Fragment key={row.name}>
                    <tr>
                      <td colSpan={4}>
                        <span style={{ fontWeight: 800, fontSize: '105%' }}>{row.name} </span>
                        {row.pop && row.pop.length > 1 && (
                          <p style={{ fontWeight: 500, fontSize: '10px', lineHeight: '8px' }}>
                            Pop: {row.pop} ({row.yr})
                          </p>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.separator} colSpan={2} />
                      <td className={classes.separator} colSpan={2} />
                    </tr>
                    <tr>
                      <td>
                        <NumberPill count={row.i} color={iColor} />
                      </td>
                      <td className={classes.term}>covid-19 infections</td>
                      <td>
                        <NumberPill count={row.ipm} color={ipmColor} />
                      </td>
                      <td className={classes.term}>infections per million</td>
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
        <svg className={classes.svgRoot} preserveAspectRatio='xMidYMid meet' width={view.width} height={view.height}>
          <g className='districts' />
          <g className='states' />
          <g className='mask' />
        </svg>
      </div>
    </>
  )
}

export default memo(Choropleth)
