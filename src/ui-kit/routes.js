import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './App'
import Typography from './components/Typography'
import Elements from './components/Elements'
import PostTypes from './components/PostTypes'

export default
  <Route path='/ui-kit' component={App}>
    <IndexRoute component={Typography} />
    <Route path='typography' component={Typography} />
    <Route path='elements' component={Elements} />
    <Route path='post-types' component={PostTypes} />
  </Route>
