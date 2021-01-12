import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import getRouteParam from 'store/selectors/getRouteParam'

const getGroup = ormCreateSelector(
  orm,
  (state, props) => props.groupId || getRouteParam('groupId', state, props),
  ({ Group }, id) => Group.safeGet({ id })
)

export default getGroup
