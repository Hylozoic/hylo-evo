import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { GROUP_RELATIONSHIP_TYPE } from 'store/models/GroupRelationshipInvite'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'

export const getChildGroups = ormCreateSelector(
  orm,
  getGroupForCurrentRoute,
  (session, group) => {
    return group.childGroups.toModelArray().sort((a, b) => a.name.localeCompare(b.name))
  }
)

export const getParentGroups = ormCreateSelector(
  orm,
  getGroupForCurrentRoute,
  (session, group) => {
    return group.parentGroups.toModelArray().sort((a, b) => a.name.localeCompare(b.name))
  }
)

export const getGroupInvitesFrom = ormCreateSelector(
  orm,
  getGroupForCurrentRoute,
  (session, group) => {
    return session.GroupRelationshipInvite.filter(i => i.fromGroup === group.id).toModelArray()
  }
)

export const getGroupInvitesTo = ormCreateSelector(
  orm,
  getGroupForCurrentRoute,
  (session, group) => {
    return session.GroupRelationshipInvite.filter(i => i.toGroup === group.id).toModelArray()
  }
)

export const getGroupInvitesToJoinUs = ormCreateSelector(
  orm,
  getGroupInvitesFrom,
  (session, invites) => {
    return invites.filter(i => i.type === GROUP_RELATIONSHIP_TYPE.ParentToChild)
  }
)

export const getGroupRequestsToJoinUs = ormCreateSelector(
  orm,
  getGroupInvitesTo,
  (session, invites) => {
    return invites.filter(i => i.type === GROUP_RELATIONSHIP_TYPE.ChildToParent)
  }
)

export const getGroupInvitesToJoinThem = ormCreateSelector(
  orm,
  getGroupInvitesTo,
  (session, invites) => {
    return invites.filter(i => i.type === GROUP_RELATIONSHIP_TYPE.ParentToChild)
  }
)

export const getGroupRequestsToJoinThem = ormCreateSelector(
  orm,
  getGroupInvitesFrom,
  (session, invites) => {
    return invites.filter(i => i.type === GROUP_RELATIONSHIP_TYPE.ChildToParent)
  }
)

export const getCurrentlyRelatedGroupIds = ormCreateSelector(
  orm,
  getParentGroups,
  getChildGroups,
  getGroupInvitesTo,
  getGroupInvitesFrom,
  (session, parents, children, invitesTo, invitesFrom) => {
    return parents.map(g => g.id).concat(children.map(g => g.id)).concat(invitesTo.map(i => i.fromGroup.id)).concat(invitesFrom.map(i => i.toGroup.id))
  }
)
