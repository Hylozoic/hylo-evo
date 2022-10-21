import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { rootDomId } from 'client/util'
import App from './router'
import Loading from 'components/Loading'

import './client/websockets'
import './css/global/index.scss'
import './i18n'

const App = React.lazy(() => import('./router'))
const HyloEditorMobile = React.lazy(() => import('components/HyloEditor/HyloEditorMobile'))

ReactDOM.render(
  <Suspense fallback={<Loading />}>
    <App />
  </Suspense>,
  document.getElementById(rootDomId)
)
