// @ts-nocheck
import { createStyles, makeStyles } from '@material-ui/core'
import * as d3 from 'd3'
import { ScaleThreshold } from 'd3'
import React, { memo, useEffect } from 'react'
import useResponsiveView from '../../hooks/useResponsiveView'
import colorLegend from './colorLegend'

interface Props {
  readonly color: ScaleThreshold<number, string>
  readonly title?: string
  readonly width?: number
}

const useStyles = makeStyles(() =>
  createStyles({
    mapRoot: {
      maxHeight: '60px',
      minWidth: '400px',
      overflow: 'visible',
      zIndex: 100,
    },
    svgRoot: {
      minHeight: '200px',
    },
  })
)

const ChoroLegend: React.FC<Props> = ({ color, title = 'Infections per million population', width = 320 }) => {
  const classes = useStyles()
  const view = useResponsiveView({ marginTop: 70, marginLeft: 5, marginBottom: 0, marginRight: 5 })

  useEffect(() => {
    console.log('render chorolegend')
    const maybeDiv: unknown = view.ref.current
    if (!maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement
    const svg = d3.select(el).select('svg')
    const gLegend = svg.select('.colorLegend')
    gLegend
      .call(colorLegend, {
        color,
        title,
        width,
      })
      .attr('transform', `translate(${view.innerWidth - 340},20)`)

    return () => {
      console.log('cleanup chorolegend')
    }
  }, [color, title, view.innerWidth, view.ref, width])

  return (
    <>
      <div ref={view.ref} className={classes.mapRoot}>
        <svg className={classes.svgRoot} preserveAspectRatio='xMidYMid meet' width={view.width} height={view.height}>
          <g className='colorLegend' />
        </svg>
      </div>
    </>
  )
}

export default memo(ChoroLegend)
