import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import getMyMemberships from 'store/selectors/getMyMemberships'
import hasResponsibilityForGroup from 'store/selectors/hasResponsibilityForGroup'
import { RESP_ADD_MEMBERS } from 'store/constants'

const getMyHostedGroups = ormCreateSelector(
  orm,
  getMyMemberships,
  (session, memberships) => {
    return memberships.filter(m => hasResponsibilityForGroup(session, { group: m.group, responsibility: RESP_ADD_MEMBERS })).map(m => m.group.ref)
  }
)

export default getMyHostedGroups
