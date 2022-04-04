import { createSelector } from 'reselect'
import { getGroupSlugInPath } from 'util/navigation'
import getRouteParam from './getRouteParam'

const isGroupRoute = createSelector(
  getSlugFromLocation,
  slug => !!slug
)

export default isGroupRoute

export function getSlugFromLocation (state, props) {
  return getRouteParam('groupSlug', state, props, false) || getRouteParam('detailGroupSlug', state, props, false) || tryLocation(props) || props.groupSlug
}

// this is a workaround for fetching the slug from the current path when you are
// in a component, like PrimaryLayout, that isn't matching a route where the
// slug is a parameter
function tryLocation (props) {
  if (!props.location) return null
  return getGroupSlugInPath(props.location.pathname)
}
