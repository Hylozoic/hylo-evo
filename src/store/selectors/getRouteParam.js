import { curry, get } from 'lodash/fp'

const getRouteParam = curry((key, state, props, warn = true) => {
  if (warn && !props.match) console.warn(`getRouteParam('${key}') missing props.match`)
  return get(['match', 'params', key], props)
})

export default getRouteParam
