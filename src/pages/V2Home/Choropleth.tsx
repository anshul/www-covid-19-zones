// @ts-nocheck
import React, { useEffect, useMemo, memo } from 'react'
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

const useStyles = makeStyles(() =>
  createStyles({
    mapRoot: {
      height: 'calc(100vh - 300px)',
      maxHeight: 'calc(100vh - 300px)',
      minHeight: '400px',
      minWidth: '400px',
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
  })
)
declare global {
  interface Window {
    choropleth: any
  }
}

window.choropleth = window.choropleth || { topojson, d3 }

const colors = {
  palette: ['#fffcf9', '#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704', '#641A2C'],
}
const thresholds = [3, 5, 10, 20, 40, 60, 80, 100, 250, 1000]

const Choropleth: React.FC<Props> = ({ map, data, go, mode, dateRange, logScale, colorMap }) => {
  const classes = useStyles()
  const view = useResponsiveView({ marginTop: 10 })
  const color = useMemo(() => d3.scaleThreshold().domain(thresholds).range(colors.palette), [])
  const colorHex = (count: number): string => color(count)

  useEffect(() => {
    console.log('render choropleth', { map, data })
    const maybeDiv: unknown = view.ref.current
    if (!map || !maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement
    const svg = d3.select(el).select('svg')
    console.log('d3 update', svg)

    const gLegend = svg.select('.colorLegend')
    gLegend
      .call(colorLegend, {
        color: color,
        title: 'Infections per million population',
        width: 320,
      })
      .attr('transform', `translate(${view.innerWidth - 340},20)`)

    return () => {
      console.log('d3 cleanup')
    }
  }, [color, data, map, view.innerWidth, view.ref])

  return (
    <>
      <Row start='xs'>
        {data &&
          data.zones.map((zone) => (
            <Col className='fade' xs={6} sm={4} md={3} lg={2} key={zone.code}>
              <ZoneCard lineColor={colorMap[zone.code]} ipmColor={colorHex} zone={zone} />
            </Col>
          ))}
      </Row>

      <div ref={view.ref} className={classes.mapRoot}>
        <svg className={classes.svgRoot} preserveAspectRatio='xMidYMid meet' width={view.width} height={view.height}>
          <g className='colorLegend' />
          <g className='states' />
          <g className='districts' />
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
