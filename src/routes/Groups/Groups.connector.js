import { connect } from 'react-redux'
import { inviteGroupToJoinParent, requestToAddGroupToParent } from 'store/actions/groupActions'
import getCanModerate from 'store/selectors/getCanModerate'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import { getPossibleRelatedGroups } from './Groups.store'

export function mapStateToProps (state, props) {
  const group = getGroupForCurrentRoute(state, props)
  const canModerate = getCanModerate(state, { group })
  const queryProps = { groupSlug: group.slug }
  const childGroups = getChildGroups(state, queryProps)
  const parentGroups = getParentGroups(state, queryProps)
  const possibleRelatedGroups = getPossibleRelatedGroups(state, props)

  return {
    canModerate,
    childGroups,
    group,
    parentGroups,
    possibleChildren: possibleRelatedGroups,
    possibleParents: possibleRelatedGroups
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    inviteGroupToJoinParent: (parentId, childId) => () => dispatch(inviteGroupToJoinParent(parentId, childId)),
    requestToAddGroupToParent: (parentId, childId) => () => dispatch(requestToAddGroupToParent(parentId, childId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
