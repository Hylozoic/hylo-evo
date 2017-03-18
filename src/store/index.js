import { createStore } from 'redux'

import enhancer from './enhancer'
import reducer from './reducer'

export default createStore(reducer, enhancer)
