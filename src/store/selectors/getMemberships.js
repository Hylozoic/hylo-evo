import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

const getMemberships = ormCreateSelector(
  orm,
  state => state.orm,
  ({ Me }) => {
    const me = Me.first()
    if (!me) return []
    return me.memberships.toModelArray()
  }
)

export default getMemberships
