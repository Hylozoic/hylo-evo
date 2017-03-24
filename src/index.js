import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import router from './router'
import store from './store'

if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
  ReactDOM.render(
    <Provider store={store}>{router}</Provider>,
    document.getElementById('root')
  )
}

export default <Provider store={store}>{router}</Provider>
