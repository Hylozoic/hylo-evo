import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { clientRouter, history } from './router'
import createStore from './store'
import './client/websockets'
import { rootDomId } from 'client/util'

// Apollo Setup for possible use with Hylo-node backend 
//
// import { ApolloProvider } from 'react-apollo'
// import apolloClient from 'client/apolloClient'

// * Only turn on for testing
// apolloClient.resetStore()

// ReactDOM.render(
//   <ApolloProvider client={apolloClient}>
//     <Provider store={store}>
//       { clientRouter() }
//     </Provider>,
//   </ApolloProvider>,
//   document.getElementById(rootDomId)
// )

const store = createStore(history)

ReactDOM.render(
  <Provider store={store}>
    { clientRouter() }
  </Provider>,
  document.getElementById(rootDomId)
)
