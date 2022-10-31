import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { rootDomId } from 'client/util'
import Loading from 'components/Loading'
import './client/websockets'
import './css/global/index.scss'

const App = React.lazy(() => import('./router'))
const HyloEditorMobile = React.lazy(() => import('components/HyloEditor/HyloEditorMobile'))
const Feature = React.lazy(() => import('components/PostCard/Feature'))

const renderRoot = () => {
  switch (window.location.pathname) {
    case '/hyloApp/editor': {
      return (
        <Suspense fallback={() => null}>
          <HyloEditorMobile />
        </Suspense>
      )
    }

    case '/hyloApp/videoPlayer': {
      const querystringParams = new URLSearchParams(window.location.search)

      return (
        <Suspense fallback={() => null}>
          <Feature url={querystringParams.get('url')} />
        </Suspense>
      )
    }

    default: {
      return (
        <Suspense fallback={() => <Loading type='fullscreen' />}>
          <App />
        </Suspense>
      )
    }
  }
}

ReactDOM.render(renderRoot(), document.getElementById(rootDomId))
