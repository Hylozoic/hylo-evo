import React from 'react'
import { HistoryRouter as Router } from 'redux-first-history/rr6'
import { Provider } from 'react-redux'
// import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'
import { LayoutFlagsProvider } from 'contexts/LayoutFlagsContext'
import isWebView from 'util/webView'
import store, { history } from '../store'
import RootRouter from 'routes/RootRouter'

if (isWebView()) {
  window.ReactNativeWebView.reactRouterHistory = history
}

// same configuration you would create for the Rollbar.js SDK
// const rollbarConfig = {
//   accessToken: process.env.ROLLBAR_CLIENT_TOKEN,
//   captureUncaught: true,
//   captureUnhandledRejections: true,
//   environment: process.env.NODE_ENV,
//   server: {
//     root: "http://example.com/",
//     branch: "main"
//   },
//   code_version: "0.13.7",
//   payload: {
//     person: {
//       id: 117,
//       email: "chief@unsc.gov",
//       username: "john-halo"
//     }
//   }
// };

export default function App () {
  return (
    <LayoutFlagsProvider>
      <Provider store={store}>
        <Router history={history}>
          <RootRouter />
        </Router>
      </Provider>
    </LayoutFlagsProvider>
  )
}
