// @ts-nocheck
import { createStyles, makeStyles } from '@material-ui/styles'
import * as d3 from 'd3'
import React, { useEffect, useRef, useState } from 'react'
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
    region: {
      strokeWidth: 0.2,
      stroke: 'black',
    },
    regionSelected: {
      strokeWidth: 1.5,
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

const colors = ['#FFFFFF', '#FFFBDC', '#FFEDB8', '#FFDD94', '#FBBF69', '#F5A057', '#ED6942', '#D73534', '#BF1B3E', '#952742', '#641A2C']

const Choropleth: React.FC<Props> = ({ data, error }) => {
  const classes = useStyles()
  const mapRef = useRef(null)
  const [districtName, setDistrictName] = useState('India')
  const [ipm, setIpm] = useState(data && data.max_ipm)

  useEffect(() => {
    const maybeDiv: unknown = mapRef.current
    if (!data || !maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement
    const mapData = data['map']

    const svg = d3.select(el)
    const districts = svg.select('.districts')
    const districtsTopo = topojson.feature(mapData, mapData.objects.districts) || { features: [] }

    const states = svg.select('.states')
    const statesTopo = topojson.feature(mapData, mapData.objects.states) || { features: [] }

    const projection = d3.geoMercator()
    projection.fitHeight(500, statesTopo)
    const box = d3.geoPath(projection).bounds(statesTopo)
    svg.attr('viewBox', `0 0 ${box[1][0]} ${box[1][1]}`)

    const path = d3.geoPath(projection)
    const color = d3.scaleQuantize().domain([0, data.max_ipm]).range(colors)

    districts
      .selectAll('path')
      .data(districtsTopo.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('id', (d) => `${d.properties.slug}`)
      .style('fill', (d, i) => color(d.properties.ipm * i))
      .on('mouseenter', (d) => {
        const region = d.properties.district
        setDistrictName(region)
        setIpm(d.properties.ipm)
        d3.select(`#${d.properties.slug}`).classed(classes.regionSelected, true).raise()
      })
      .on('mouseleave', (d) => {
        const region = d.properties.district
        setDistrictName(region)
        setIpm(d.properties.ipm)
        d3.select(`#${d.properties.slug}`).classed(classes.regionSelected, false).lower()
      })

    states
      .selectAll('path')
      .data(statesTopo.features)
      .enter()
      .append('path')
      .attr('d', path)
      .classed(classes.region, true)
      .style('fill', 'transparent')

    console.log('d3 update', el, data, error)

    return () => {
      console.log('d3 cleanup')
      // d3.select(el).select('svg').remove()
    }
  }, [classes.region, classes.regionSelected, classes.state, classes.stateSelected, data, error])

  return (
    <div className={classes.mapRoot}>
      <p>{districtName}</p>
      <p>{ipm}</p>
      <svg ref={mapRef} preserveAspectRatio='xMidYMid meet' style={{ maxHeight: '500px' }}>
        <g className='states' />
        <g className='districts' />
      </svg>
    </div>
  )
}

export default Choropleth
