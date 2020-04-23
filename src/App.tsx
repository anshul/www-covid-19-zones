import React from 'react'
import './stylesheets/app.scss'
import Navbar from './components/Navbar'
import { Grid, Row } from 'react-flexbox-grid'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { pages } from './pages/pages'
import { ThemeProvider, createMuiTheme } from '@material-ui/core'
import { slateBlue, mountainMeadow } from './utils/ColorFactory'

function App() {
  return (
    <ThemeProvider
      theme={createMuiTheme({
        palette: {
          primary: {
            main: slateBlue[500],
            light: slateBlue[300],
            dark: slateBlue[600],
          },
          secondary: {
            main: mountainMeadow[500],
            light: mountainMeadow[300],
            dark: mountainMeadow[600],
            contrastText: '#fff',
          },
        },
        typography: {
          fontFamily: ['Poppins', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        },
      })}
    >
      <Router>
        <Route
          render={({ location }) => (
            <Grid>
              <Row>
                <Navbar />
              </Row>
              <Route exact path='/' render={() => <Redirect to='/zone/in' />} />
              <Switch location={location}>
                {pages.map((page) => {
                  return <Route exact key={page.displayName} style={{ marginTop: '8px' }} path={page.path} component={page.view} />
                })}
                <Redirect to='/zone/in' />
              </Switch>
            </Grid>
          )}
        />
      </Router>
    </ThemeProvider>
  )
}

export default App
