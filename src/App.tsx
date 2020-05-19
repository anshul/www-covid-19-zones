import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar'
import GenericNotFound from './pages/GenericNotFound'
import { pages } from './pages/pages'
import './stylesheets/app.scss'
import { mountainMeadow, slateBlue } from './utils/ColorFactory'

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
          fontFamily: ['Poppins', 'Lato', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        },
      })}
    >
      <Router>
        <Route
          render={({ location }) => (
            <>
              <Route path='*' exact component={Navbar} />
              <Switch location={location}>
                <Route exact path='/' render={() => <Redirect to='/zones/in' />} />
                <Route exact path='/v2' render={() => <Redirect to='/v2/zones/in' />} />
                {pages.map((page) => {
                  return <Route exact key={page.displayName} style={{ marginTop: '8px' }} path={page.path} component={page.view} />
                })}
                <Route path='*' exact={true} component={GenericNotFound} />
              </Switch>
            </>
          )}
        />
      </Router>
    </ThemeProvider>
  )
}

export default App
