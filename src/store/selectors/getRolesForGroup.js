import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getMe from './getMe'

const getRolesForGroup = ormCreateSelector(
  orm,
  (state, props) => props.person || getMe(state),
  (state, props) => props.groupId,
  (session, person, groupId) => {
    const commonRoles = session.CommonRole.all().toModelArray()
    if (typeof person === 'number' || typeof person === 'string') {
      person = session.Me.withId(person) || session.Person.withId(person)
    }
    if (!person) {
      return []
    }
    let membershipCommonRoles = ((person.membershipCommonRoles && (person.membershipCommonRoles.items || ('toModelArray' in person.membershipCommonRoles && person.membershipCommonRoles.toModelArray()) || person.membershipCommonRoles)) || []).filter(mcr => mcr.groupId === groupId)
    membershipCommonRoles = commonRoles.filter(cr => membershipCommonRoles.find(mcr => mcr.commonRoleId === cr.id)).map(cr => ({ ...cr.ref, common: true }))
    return membershipCommonRoles.concat(person.groupRoles ? person.groupRoles.items.filter(role => role.groupId === groupId) : [])
  }
)

export default getRolesForGroup
