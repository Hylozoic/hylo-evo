import { createSelector } from 'reselect'
import getRouteParam from './getRouteParam'

const isGroupRoute = createSelector(
  getSlugFromLocation,
  slug => !!slug
)

export default isGroupRoute

export function getSlugFromLocation (state, props) {
  return getRouteParam('detailGroupSlug', state, props, false) || getRouteParam('groupSlug', state, props, false) || props.groupSlug
}
