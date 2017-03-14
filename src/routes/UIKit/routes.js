import React from 'react'
import { Route, IndexRoute } from 'react-router-dom'
import UIKit from './index'
import Typography from './Typography'
import Elements from './Elements'
import PostTypes from './PostTypes'

export default
  <Route path='/ui-kit' component={UIKit}>
    <IndexRoute component={Typography} />
    <Route path='typography' component={Typography} />
    <Route path='elements' component={Elements} />
    <Route path='post-types' component={PostTypes} />
  </Route>
