import { createSelector } from 'reselect'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getGroupForSlug from 'store/selectors/getGroupForSlug'

export const getMyGroupMembership = createSelector(
  getGroupForSlug,
  getMyMemberships,
  (group, memberships) => {
    if (group && memberships.length > 0) {
      return memberships.find(m => m.group.id === group.id)
    }
  }
)

export default getMyGroupMembership
