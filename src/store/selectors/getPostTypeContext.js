import { find } from 'lodash/fp'
import { POST_TYPE_CONTEXTS } from 'util/navigation'
import getParam from './getParam'

export default function (state, props) {
  const postTypeContext = getParam('postTypeContext', state, props)

  return find(p => p === postTypeContext, POST_TYPE_CONTEXTS)
}
