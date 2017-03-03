import React from 'react'
import { Router, Route, hashHistory } from 'react-router'
import App from './App'

// LEJ: The following throws and error looking for Typography.js
//    import Typography from './components/Typography'
// Need to figure-out why webpack? is defaulting to adding the .js
// import Typography from './components/Typography/'


export default
  <Router history={hashHistory}>
    <Route path='/' component={App} />
  </Router>
