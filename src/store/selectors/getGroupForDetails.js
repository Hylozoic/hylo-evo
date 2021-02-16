import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import getRouteParam from 'store/selectors/getRouteParam'

const getGroupForDetail = ormCreateSelector(
  orm,
  (state, props) => getRouteParam('detailGroupSlug', state, props),
  ({ Group }, slug) => Group.safeGet({ slug })
)

export default getGroupForDetail
