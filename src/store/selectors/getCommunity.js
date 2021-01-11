import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import getRouteParam from 'store/selectors/getRouteParam'

const getCommunity = ormCreateSelector(
  orm,
  (state, props) => getRouteParam('communityId', state, props),
  ({ Community }, id) => {
    try {
      return Community.safeGet({ id })
    } catch (e) {
      return null
    }
  }
)

export default getCommunity
