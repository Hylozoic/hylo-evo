import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import getMyMemberships from 'store/selectors/getMyMemberships'

const getMyModeratedGroups = ormCreateSelector(
  orm,
  getMyMemberships,
  (session, memberships) => {
    const groupIds = memberships.filter(m => m.hasModeratorRole).map(m => m.group.id)
    return session.Group.filter(g => groupIds.includes(g.id)).toModelArray()
  }
)

export default getMyModeratedGroups
