import React, { useRef, useEffect } from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'

interface Props {
  data?: any
  error?: string
}

const useStyles = makeStyles(() =>
  createStyles({
    mapRoot: {
      minWidth: '500px',
      minHeight: '500px',
      border: '1px solid black',
    },
  })
)

const Choropleth: React.FC<Props> = ({ data, error }) => {
  const classes = useStyles()
  const mapRef = useRef(null)
  useEffect(() => {
    const maybeDiv: unknown = mapRef.current
    if (!maybeDiv) return
    const el: HTMLElement = maybeDiv as HTMLElement
    console.log('d3 update', el, data, error)
    return () => {
      console.log('d3 cleanup')
    }
  }, [data, error])

  return (
    <div className={classes.mapRoot}>
      <div ref={mapRef} />
    </div>
  )
}

export default Choropleth
