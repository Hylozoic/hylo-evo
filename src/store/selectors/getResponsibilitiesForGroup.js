import { isEmpty } from 'lodash'

export default function getResponsibilitiesForGroup ({ currentUser, groupId }) {
  if (!currentUser || !groupId) return []
  const commonResp = currentUser.memberships.toRefArray().filter(m => m.group === groupId).map(m => m.commonRoles.items).filter(cr => !isEmpty(cr)).flat().map(cr => cr.responsibilities.items).flat()
  const groupRolesForGroup = currentUser?.groupRoles?.items.filter(groupRole => groupRole.groupId === groupId) || []
  const resp = groupRolesForGroup.map(groupRole => groupRole.responsibilities || []).flat()
  return [...resp, ...commonResp] || []
}
