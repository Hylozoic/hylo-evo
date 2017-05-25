import { createSelector } from 'reselect'
import { getSlugInPath } from 'util/index'
import getParam from './getParam'

export const getSlugFromLocation = (state, props) =>
  getParam('slug', state, props, false) || tryLocation(props)

const isCommunityRoute = createSelector(
  getSlugFromLocation,
  slug => !!slug
)

export default isCommunityRoute

// this is a workaround for fetching the slug from the current path when you are
// in a component, like PrimaryLayout, that isn't matching a route where the
// slug is a parameter
function tryLocation (props) {
  if (!props.location) return null
  return getSlugInPath(props.location.pathname)
}
