import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'

// TODO: change to just be getGroupFromSlug

const getGroupForCurrentRoute = ormCreateSelector(
  orm,
  (state, slug) => slug,
  (session, slug) => session.Group.safeGet({ slug })
)

export default getGroupForCurrentRoute
