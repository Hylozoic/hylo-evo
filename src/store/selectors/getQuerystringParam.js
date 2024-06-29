import { pick } from 'lodash/fp'
import qs from 'querystring'

const getQuerystringParam = (key, state, props) => {
  if (!props.location) throw new Error(`getQuerystringParam('${key}') missing props.location`)
  const query = qs.parse(props.location.search.substring(1))
  return Array.isArray(key) ? pick(key, query) : query[key]
}

export default getQuerystringParam
