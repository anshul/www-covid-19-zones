import React, { useState, SyntheticEvent } from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, IconButton, Theme, Menu, MenuItem, Fade } from '@material-ui/core'
import { IoIosMenu } from 'react-icons/io'
import { Grid } from 'react-flexbox-grid'
import { RouteComponentProps } from 'react-router-dom'

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
interface MenuItemDefinition {
  label: string
  link: string
}

interface MenuDefinition {
  [key: string]: MenuItemDefinition
}

const menuItems: MenuDefinition = {
  home: {
    label: 'Home',
    link: '/',
  },
}

const Navbar: React.FC<RouteComponentProps<{}>> = ({ match, history }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const open = Boolean(anchorEl)

  const toggleMenu = (event: SyntheticEvent) => setAnchorEl(open ? null : event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const onMenuItemClick = (event: SyntheticEvent) => {
    const key = event.currentTarget.getAttribute('data-item') as string
    if (menuItems[key]) {
      history.push(menuItems[key].link)
      handleClose()
    }
  }

  return (
    <div className={classes.root}>
      <Grid>
        <AppBar position='static' className={classes.navbar}>
          <Toolbar>
            {Object.keys(menuItems).length > 1 && (
              <>
                <IconButton edge='start' aria-controls='fade-menu' aria-haspopup={true} onClick={toggleMenu}>
                  <IoIosMenu />
                </IconButton>

                <Menu anchorEl={anchorEl} style={{ marginTop: '30px' }} open={open} onClose={toggleMenu} TransitionComponent={Fade}>
                  {Object.keys(menuItems).map((key) => (
                    <MenuItem key={key} data-item={key} onClick={onMenuItemClick}>
                      <Typography variant='body1' style={{ minWidth: '100px' }}>
                        {menuItems[key].label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}

            <Link to='/' className={classes.link}>
              <Typography variant='h6' className={classes.title}>
                Covid-19 <span>Zones</span>
              </Typography>
            </Link>
            {/* <IconButton edge='end'>
              <IoIosMoon />
            </IconButton> */}
          </Toolbar>
        </AppBar>
      </Grid>
    </div>
  )
}

export default Navbar
