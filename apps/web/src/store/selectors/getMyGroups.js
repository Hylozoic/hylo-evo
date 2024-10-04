import { createSelector } from 'redux-orm'
import orm from 'store/models'
import getMyMemberships from 'store/selectors/getMyMemberships'

export const getMyGroups = createSelector(
  orm,
  getMyMemberships,
  (_, memberships) => {
    return memberships
      .map(m => ({ ...m.group.ref, newPostCount: m.newPostCount }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }
)

export default getMyGroups
