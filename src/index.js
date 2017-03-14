import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import PrimaryLayout from 'routes/PrimaryLayout'
import UIKit from 'routes/UIKit'

ReactDOM.render(<BrowserRouter>
  <Switch>
    <Route path='/' component={PrimaryLayout} />
    <Route path='/ui-kit' component={UIKit} />
  </Switch>
</BrowserRouter>, document.getElementById('root'))
