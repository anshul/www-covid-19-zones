import React, { useRef, useEffect } from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import * as d3 from 'd3'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'
import { DateRangeT, UrlT } from '../../types'

const useStyles = makeStyles(() =>
  createStyles({
    chartRoot: {
      border: '1px dashed green',
    },
  })
)
declare global {
  interface Window {
    c: any
  }
}
interface Props {
  data: V2HomeRoot_data | null
  go: (target: UrlT) => void
  mode: string
  dateRange: DateRangeT
  logScale: boolean
}

window.c = window.c || { d3 }

const Chart: React.FC<Props> = ({ mode, data, go, dateRange, logScale }) => {
  const classes = useStyles()
  const chartRef = useRef(null)
  useEffect(() => {
    const maybeDiv: unknown = chartRef.current
    if (!data || !maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement

    const svg = d3.select(el)
    console.log('d3 update', el, svg)

    return () => {
      console.log('d3 cleanup')
      // d3.select(el).select('svg').remove()
    }
  }, [data])

  return (
    <div className={classes.chartRoot}>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data)}</pre>
      <svg ref={chartRef} preserveAspectRatio='xMidYMid meet' style={{ maxHeight: '500px' }}></svg>
    </div>
  )
}

export default Chart
