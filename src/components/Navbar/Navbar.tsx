import React from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Col } from 'react-flexbox-grid'

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
    <Col xs={12} xl={8} xlOffset={2} className={classes.navbar}>
      <h3 className={classes.title}>
        COVID-19 <span>Zones</span>
      </h3>
    </Col>
  )
}

export default Navbar
