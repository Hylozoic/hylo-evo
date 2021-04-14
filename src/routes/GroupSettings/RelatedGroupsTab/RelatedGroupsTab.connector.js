import { connect } from 'react-redux'
import {
  acceptGroupRelationshipInvite,
  cancelGroupRelationshipInvite,
  deleteGroupRelationship,
  inviteGroupToJoinParent,
  rejectGroupRelationshipInvite,
  requestToAddGroupToParent
} from 'store/actions/groupRelationshipActions'
import {
  getChildGroups,
  getGroupInvitesToJoinThem,
  getGroupInvitesToJoinUs,
  getParentGroups,
  getGroupRequestsToJoinThem,
  getGroupRequestsToJoinUs
} from 'store/selectors/getGroupRelationships'
import presentGroupRelationshipInvite from 'store/presenters/presentGroupRelationshipInvite'
import { fetchGroupToGroupJoinQuestions, getPossibleRelatedGroups, getSearch } from './RelatedGroupsTab.store'

export function mapStateToProps (state, props) {
  const search = getSearch(state, props)
  const group = props.group
  const queryProps = { groupSlug: group.slug, search }
  const childGroups = getChildGroups(state, queryProps)
  const parentGroups = getParentGroups(state, queryProps)
  const possibleRelatedGroups = getPossibleRelatedGroups(state, props)

  return {
    childGroups,
    group: props.group,
    parentGroups,
    groupInvitesToJoinUs: getGroupInvitesToJoinUs(state, queryProps),
    groupRequestsToJoinUs: getGroupRequestsToJoinUs(state, queryProps).map(i => presentGroupRelationshipInvite(i)),
    groupInvitesToJoinThem: getGroupInvitesToJoinThem(state, queryProps),
    groupRequestsToJoinThem: getGroupRequestsToJoinThem(state, queryProps),
    possibleChildren: possibleRelatedGroups,
    possibleParents: possibleRelatedGroups,
    search
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    acceptGroupRelationshipInvite: (groupRelationshipInviteId) => () => dispatch(acceptGroupRelationshipInvite(groupRelationshipInviteId)),
    cancelGroupRelationshipInvite: (groupRelationshipInviteId) => () => dispatch(cancelGroupRelationshipInvite(groupRelationshipInviteId)),
    deleteGroupRelationship: (parentId, childId) => dispatch(deleteGroupRelationship(parentId, childId)),
    fetchGroupToGroupJoinQuestions: () => dispatch(fetchGroupToGroupJoinQuestions()),
    inviteGroupToJoinParent: (parentId, childId) => dispatch(inviteGroupToJoinParent(parentId, childId)),
    rejectGroupRelationshipInvite: (groupRelationshipInviteId) => () => dispatch(rejectGroupRelationshipInvite(groupRelationshipInviteId)),
    requestToAddGroupToParent: (parentId, childId, questionAnswers) => dispatch(requestToAddGroupToParent(parentId, childId, questionAnswers.map(q => { return { questionId: q.questionId, answer: q.answer } })))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
