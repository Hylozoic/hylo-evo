import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { rootDomId } from 'client/util'
import Loading from 'components/Loading'

import './client/websockets'
import './css/global/index.scss'

const App = React.lazy(() => import('./router'))
const HyloEditorMobile = React.lazy(() => import('components/HyloEditor/HyloEditorMobile'))

ReactDOM.render(
  window.location.pathname === '/hyloApp/editor'
    ? (
      <Suspense fallback={() => null}>
        <HyloEditorMobile />
      </Suspense>
    ) : (
      <Suspense fallback={() => <Loading type='fullscreen' />}>
        <App />
      </Suspense>
    ),
  document.getElementById(rootDomId)
)
