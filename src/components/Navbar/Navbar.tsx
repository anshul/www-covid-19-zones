import React from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import { RouteComponentProps, Link } from 'react-router-dom'
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

const Navbar: React.FC<RouteComponentProps<{}>> = ({ match, history }) => {
  const classes = useStyles()
  const gotoHome = () => history.push(`/`)

  return (
    <Col xs={12} className={classes.navbar}>
      <Link to='/' style={{ textDecoration: 'none' }}>
        <h4 className={classes.title}>
          COVID-19 <span>Zones</span>
        </h4>
      </Link>
    </Col>
  )
}

export default Navbar
