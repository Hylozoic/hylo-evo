import { curry, get } from 'lodash/fp'

const getParam = curry((key, state, props) => {
  if (!props.match) console.warn('getParam was used on props without params')
  return get(['match', 'params', key], props)
})

export default getParam
