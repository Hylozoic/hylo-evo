import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { getSlugFromLocation } from './isGroupRoute'

const getGroupForCurrentRoute = ormCreateSelector(
  orm,
  getSlugFromLocation,
  (session, slug) => session.Group.safeGet({ slug })
)

export default getGroupForCurrentRoute
