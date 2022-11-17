import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { rootDomId } from 'client/util'
import Loading from 'components/Loading'
import App from './router'
import './client/websockets'
import './css/global/index.scss'

// import i18n (needs to be bundled ;))
import './i18n'

ReactDOM.render(
  <Suspense fallback={<Loading />}>
    <App />
  </Suspense>,
  document.getElementById(rootDomId)
)
