import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import PrimaryLayout from './PrimaryLayout'
import UIKit from './UIKit'

const routes = <BrowserRouter>
  <Switch>
    <Route path='/ui-kit' component={UIKit} />
    <Route path='/' component={PrimaryLayout} />
  </Switch>
</BrowserRouter>

export default routes
