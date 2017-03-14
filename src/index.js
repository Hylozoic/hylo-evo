import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import PrimaryLayout from 'routes/PrimaryLayout'
import UIKit from 'routes/UIKit'

ReactDOM.render(<BrowserRouter>
  <Switch>
    <Route path='/ui-kit' component={UIKit} />
    <Route path='/' component={PrimaryLayout} />
  </Switch>
</BrowserRouter>, document.getElementById('root'))
