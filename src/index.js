import React from 'react'
import ReactDOM from 'react-dom'
import { rootDomId } from 'client/util'
import App from './router'
import './client/websockets'
import './css/global/index.scss'

ReactDOM.render(
  <App />,
  document.getElementById(rootDomId)
)
