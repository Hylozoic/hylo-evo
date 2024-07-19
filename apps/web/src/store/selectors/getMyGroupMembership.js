import { createSelector } from 'reselect'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getGroupForCurrentRoute from './getGroupForCurrentRoute'

export const getMyGroupMembership = createSelector(
  getGroupForCurrentRoute,
  getMyMemberships,
  (group, memberships) => {
    if (group && memberships.length > 0) {
      return memberships.find(m => m.group.id === group.id)
    }
  }
)

export default getMyGroupMembership
