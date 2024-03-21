import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { get } from 'lodash/fp'

const getCanModerate = ormCreateSelector(
  orm,
  (state, props) => props.group,
  (state, props) => props.additionalResponsibility,
  ({ Me, Membership }, group, additionalResponsibility = '') => {
    const me = Me.first()
    if (group && me) {
      const membership = Membership.safeGet({ group: group.id, person: me.id })
      if (!membership) return false
      const commonResp = membership.commonRoles.items.map(cr => cr.responsibilities.items).flat()
      const groupRolesForGroup = me?.groupRoles?.items.filter(groupRole => groupRole.groupId === group.id) || []
      const resp = groupRolesForGroup.map(groupRole => groupRole.responsibilities.items || []).flat()
      const combinedResponsibilities = [...resp, ...commonResp].map(r => r.title)

      return get('hasModeratorRole', membership) || combinedResponsibilities.includes(additionalResponsibility)
    } else {
      return false
    }
  }
)

export default getCanModerate
