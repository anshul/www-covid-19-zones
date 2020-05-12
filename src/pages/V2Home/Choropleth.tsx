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
      minWidth: '500px',
      minHeight: '500px',
      border: '1px solid black',
    },
  })
)
declare global {
  interface Window {
    choropleth: any
  }
}

window.choropleth = window.choropleth || { topojson, d3 }

const Choropleth: React.FC<Props> = ({ data, error }) => {
  const classes = useStyles()
  const mapRef = useRef(null)
  useEffect(() => {
    const maybeDiv: unknown = mapRef.current
    if (!maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement
    if (!data) return
    const map = data.map
    window.choropleth.map = map

    const svg = d3.select(el).append('svg').attr('height', 500).attr('width', 500)
    const g = svg.append('g')
    window.choropleth.g = g
    const projection = d3.geoMercator()
    const features = (topojson.feature(map, map.objects.covid19zones) as any).features

    const path: any = d3.geoPath()
    g.selectAll('path').data(features).enter().append('path').attr('d', path).style('stroke-width', '2')

    console.log('d3 update', el, data, error)

    return () => {
      console.log('d3 cleanup')
      d3.select(el).select('svg').remove()
    }
  }, [data, error])

  return (
    <div className={classes.mapRoot}>
      <div ref={mapRef} />
    </div>
  )
}

export default Choropleth
