import { getViewContextInPath } from 'util/navigation'
import getPostTypeContext from './getPostTypeContext'

const getViewContextForCurrentRoute = (state, props) =>
  getPostTypeContext(state, props) ||
  tryLocation(props)

// this is a workaround for fetching the slug from the current path when you are
// in a component, like PrimaryLayout, that isn't matching a route where the
// slug is a parameter
function tryLocation (props) {
  if (!props.location) return null
  return getViewContextInPath(props.location.pathname)
}

export default getViewContextForCurrentRoute
