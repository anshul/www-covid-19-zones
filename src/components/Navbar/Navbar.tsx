import React, { useState } from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, IconButton, Theme, MenuList, MenuItem } from '@material-ui/core'
import { IoIosMenu, IoIosMoon, IoIosClose } from 'react-icons/io'
import { Grid } from 'react-flexbox-grid'

interface Props {
  path: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#FAFAFA',
      flexGrow: 1,
    },
    navbar: {
      backgroundColor: '#FAFAFA',
      boxShadow: 'none',
    },
    link: {
      flexGrow: 1,
      textAlign: 'center',
      textDecoration: 'unset',
    },
    title: {
      fontWeight: 500,
      '& > span': {
        fontWeight: 400,
      },
    },
    drawer: {
      height: '100%',
      backgroundColor: '#FAFAFA',
    },
  })
)

const Navbar: React.FC<Props> = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  return (
    <div className={classes.root}>
      <Grid>
        <AppBar position='static' className={classes.navbar}>
          <Toolbar>
            <IconButton edge='start' onClick={() => setOpen(!open)}>
              {open ? <IoIosClose /> : <IoIosMenu />}
            </IconButton>
            <Link to='/' className={classes.link}>
              <Typography variant='h6' className={classes.title}>
                Covid19 <span>Zones</span>
              </Typography>
            </Link>
            {/* <IconButton edge='end'>
              <IoIosMoon />
            </IconButton> */}
          </Toolbar>
        </AppBar>
        {open && (
          <div className={classes.drawer}>
            <MenuList>
              <MenuItem>
                <Typography variant='body1'>Home</Typography>
              </MenuItem>
              <MenuItem>
                <Typography variant='body1'>FAQ</Typography>
              </MenuItem>
            </MenuList>
          </div>
        )}
      </Grid>
    </div>
  )
}

export default Navbar
