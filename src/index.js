import React from 'react'
import ReactDOM from 'react-dom'
import routes from './routes'
import { BrowserRouter } from 'react-router-dom'

const app = <BrowserRouter>{routes}</BrowserRouter>
ReactDOM.render(app, document.getElementById('root'))
