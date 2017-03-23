import React from 'react'
import createHistory from 'history/createBrowserHistory'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import PrimaryLayout from '../routes/PrimaryLayout'
import UIKit from '../routes/UIKit'

export default <ConnectedRouter history={createHistory()}>
  <Switch>
    <Route path='/ui-kit' component={UIKit} />
    <Route path='/' component={PrimaryLayout} />
  </Switch>
</ConnectedRouter>
