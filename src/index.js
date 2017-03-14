import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import PrimaryLayout from 'routes/PrimaryLayout'

ReactDOM.render(<BrowserRouter>
  <Route path='/' exact component={PrimaryLayout} />
</BrowserRouter>, document.getElementById('root'))
