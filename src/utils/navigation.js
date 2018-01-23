import qs from 'querystring'
import { isEmpty, omitBy } from 'lodash'

export function makeUrl (path, params) {
  params = omitBy(params, x => !x)
  return `${path}${!isEmpty(params) ? '?' + qs.stringify(params) : ''}`
}
