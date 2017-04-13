import { curry, get } from 'lodash/fp'

const getParam = curry((key, state, props) =>
  get(['match', 'params', key], props))

export default getParam
