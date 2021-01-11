import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { getSlugFromLocation } from './isCommunityRoute'

const getCommunityForCurrentRoute = ormCreateSelector(
  orm,
  getSlugFromLocation,
  (session, slug) => session.Community.safeGet({ slug })
)

export default getCommunityForCurrentRoute
