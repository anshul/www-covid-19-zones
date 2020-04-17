import React from 'react'
import './stylesheets/app.scss'
import Navbar from './components/Navbar'
import { Grid } from 'react-flexbox-grid'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { pages } from './pages/pages'

function App() {
  return (
    <Router>
      <Route
        render={({ location }) => (
          <Grid>
            <Navbar />
            <Route exact path='/' render={() => <Redirect to='/' />} />
            <Switch location={location}>
              {pages.map((page) => {
                return <Route exact key={page.displayName} style={{ marginTop: '8px' }} path={page.path} component={page.view} />
              })}
              <Redirect to='/' />
            </Switch>
          </Grid>
        )}
      />
    </Router>
  )
}

export default App
