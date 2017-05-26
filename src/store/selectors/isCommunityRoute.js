import { createSelector } from 'reselect'
import { getSlugInPath } from 'util/index'
import getParam from './getParam'

const isCommunityRoute = createSelector(
  getSlugFromLocation,
  slug => !!slug
)

export default isCommunityRoute

export function getSlugFromLocation (state, props) {
  return getParam('slug', state, props, false) ||
    tryLocation(props) ||
    props.slug
}

// this is a workaround for fetching the slug from the current path when you are
// in a component, like PrimaryLayout, that isn't matching a route where the
// slug is a parameter
function tryLocation (props) {
  if (!props.location) return null
  return getSlugInPath(props.location.pathname)
}
