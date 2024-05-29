import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getMe from './getMe'

const getResponsibilitiesForGroup = ormCreateSelector(
  orm,
  (state, props) => props.person || getMe(state),
  (state, props) => props.groupId,
  ({ CommonRole }, person, groupId) => {
    if (!person || !groupId) return []
    const commonRoles = CommonRole.all().toModelArray()
    const membershipCommonRoles = person.membershipCommonRoles.items.filter(mcr => mcr.groupId === groupId)
    const commonResp = commonRoles.filter(cr => membershipCommonRoles.find(mcr => mcr.commonRoleId === cr.id)).map(cr => cr.responsibilities.items).flat()
    const groupRolesForGroup = person?.groupRoles?.items.filter(groupRole => groupRole.groupId === groupId) || []
    const resp = groupRolesForGroup.map(groupRole => groupRole.responsibilities.items || []).flat()
    return [...resp, ...commonResp] || []
  }
)

export default getResponsibilitiesForGroup
