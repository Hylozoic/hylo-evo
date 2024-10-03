import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getGroupForSlug = ormCreateSelector(
  orm,
  (state, slug) => slug,
  (session, slug) => session.Group.safeGet({ slug })
)

export default getGroupForSlug
