import { find } from 'lodash/fp'
import { POST_TYPE_CONTEXTS } from 'util/navigation'
import getRouteParam from './getRouteParam'

export default function (state, props) {
  const postTypeContext = getRouteParam('view', state, props) || getRouteParam('postTypeContext', state, props)

  return find(p => p === postTypeContext, POST_TYPE_CONTEXTS)
}
