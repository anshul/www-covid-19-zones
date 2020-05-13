import React, { useRef, useEffect } from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import * as d3 from 'd3'
import * as topojson from 'topojson'

export interface ChoroplethResponse {
  data?: any
  error?: string
}

type Props = ChoroplethResponse

const useStyles = makeStyles(() =>
  createStyles({
    mapRoot: {
      border: '1px solid black',
    },
    district: {
      strokeWidth: 0.2,
      stroke: 'black',
    },
  })
)
declare global {
  interface Window {
    choropleth: any
  }
}

window.choropleth = window.choropleth || { topojson, d3 }

const colors: any = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']

const Choropleth: React.FC<Props> = ({ data, error }) => {
  const classes = useStyles()
  const mapRef = useRef(null)
  useEffect(() => {
    const maybeDiv: unknown = mapRef.current
    if (!data || !maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement
    const mapData = data['map']

    const svg = d3.select(el)
    const districts = svg.select('.districts')
    const districtTopo = (topojson.feature(mapData, mapData.objects.districts) as any) || { features: [] }

    const projection = d3.geoMercator()
    projection.fitHeight(500, districtTopo)
    const box = d3.geoPath(projection).bounds(districtTopo)
    svg.attr('viewBox', `0 0 ${box[1][0]} ${box[1][1]}`)

    const path: any = d3.geoPath(projection)
    const color = d3.scaleQuantize().domain([0, data.max_ipm]).range(colors)
    districts
      .selectAll('path')
      .data(districtTopo.features)
      .enter()
      .append('path')
      .attr('d', path)
      .classed(classes.district, true)
      .style('fill', (d, i) => color((d as any).properties.ipm as number))

    console.log('d3 update', el, data, error)

    return () => {
      console.log('d3 cleanup')
      // d3.select(el).select('svg').remove()
    }
  }, [classes.district, data, error])

  return (
    <div className={classes.mapRoot}>
      <svg ref={mapRef} preserveAspectRatio='xMidYMid meet' style={{ maxHeight: '500px' }}>
        <g className='districts' />
      </svg>
    </div>
  )
}

export default Choropleth
