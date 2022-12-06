import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { rootDomId } from 'client/util'
import App from './router'
import Loading from 'components/Loading'

import './client/websockets'
import './css/global/index.scss'
import './i18n'

ReactDOM.render(
  <Suspense fallback={<Loading />}>
    <App />
  </Suspense>,
  document.getElementById(rootDomId)
)
