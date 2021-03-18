import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

const getMyJoinRequests = ormCreateSelector(
  orm,
  ({ Me, JoinRequest }) => {
    const me = Me.first()
    if (!me) return []
    return me.joinRequests.toModelArray()
  }
)

export default getMyJoinRequests
