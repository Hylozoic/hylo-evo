import { curry, get } from 'lodash/fp'

const getParam = curry((key, state, props, warn = true) => {
  if (warn && !props.match) console.warn(`getParam('${key}') missing props.match`)
  return get(['match', 'params', key], props)
})

export default getParam
