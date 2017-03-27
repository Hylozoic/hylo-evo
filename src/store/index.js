import { createStore } from 'redux'

import middleware from './middleware'
import orm from './models'
import reducers from './reducers'

const initialState = {
  orm: orm.getEmptyState()
}

export default createStore(reducers, initialState, middleware)
