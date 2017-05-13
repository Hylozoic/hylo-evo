import React from 'react'
import { Provider } from 'react-redux'
import createHistory from 'history/createMemoryHistory'
import { MemoryRouter } from 'react-router-dom'
import createStore from 'store'

const history = createHistory()
const store = createStore(history)

export default function (props) {
  return <Provider store={store}><MemoryRouter>{props.children}</MemoryRouter></Provider>
}
