import { createSelector } from 'reselect'
import getRouteParam from './getRouteParam'

const isGroupRoute = createSelector(
  getSlugFromLocation,
  slug => !!slug
)

export default isGroupRoute

export function getSlugFromLocation (state, props) {
  return getRouteParam('detailGroupSlug', props, false) || getRouteParam('groupSlug', props, false) || props.groupSlug
}
