import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import UIKit from './index'
import Typography from './Typography'
import Elements from './Elements'
import PostTypes from './PostTypes'

export default function () {
  return
    <Switch path='/ui-kit' exact component={UIKit}>
      <Route path='/' component={Typography} />
      <Route path='typography' component={Typography} />
      <Route path='elements' component={Elements} />
      <Route path='post-types' component={PostTypes} />
    </Route>
}
