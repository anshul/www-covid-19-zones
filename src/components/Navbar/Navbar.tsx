import React from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'

const useStyles = makeStyles(() =>
  createStyles({
    navbar: {
      width: '100%',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
    },
    title: {
      fontWeight: 600,
      '& > span': {
        fontWeight: 400,
      },
    },
  })
)

const Navbar: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.navbar}>
      <h3 className={classes.title}>
        COVID-19 <span>Zones</span>
      </h3>
    </div>
  )
}

export default Navbar
