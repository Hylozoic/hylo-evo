import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PrimaryLayout from './PrimaryLayout'
import UIKit from './UIKit'

const routes = <Switch>
  <Route path='/ui-kit' component={UIKit} />
  <Route path='/' component={PrimaryLayout} />
</Switch>

export default routes
