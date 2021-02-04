import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import presentGroup from 'store/presenters/presentGroup'
import getCanModerate from 'store/selectors/getCanModerate'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import getMyModeratedGroups from 'store/selectors/getMyModeratedGroups'
import getRouteParam from 'store/selectors/getRouteParam'
import { inviteGroupToJoinParent, requestToAddGroupToParent } from './Groups.store'

export function mapStateToProps (state, props) {
  const group = getGroupForCurrentRoute(state, props)
  const canModerate = getCanModerate(state, { group })
  const groupSlug = getRouteParam('groupSlug', state, props)
  const queryProps = { groupSlug }
  const childGroups = getChildGroups(state, queryProps)
  const childGroupIds = childGroups.map(g => g.id)
  const moderatedGroups = getMyModeratedGroups(state, props)
  const parentGroups = getParentGroups(state, queryProps)
  const parentGroupIds = parentGroups.map(g => g.id)

  console.log("can mod = ", canModerate)
  return {
    canModerate,
    childGroups,
    group,
    groupSlug,
    parentGroups,
    // TODO: check for cycles, cant add a grandparent as a child
    possibleChildren: moderatedGroups.filter(mg => mg.id !== group.id && !childGroupIds.includes(mg.id) && !parentGroupIds.includes(mg.id)),
    possibleParents: moderatedGroups.filter(mg => mg.id !== group.id && !parentGroupIds.includes(mg.id) && !childGroupIds.includes(mg.id))
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    inviteGroupToJoinParent: (parentId, childId) => () => dispatch(inviteGroupToJoinParent(parentId, childId)),
    requestToAddGroupToParent: (parentId, childId) => () => dispatch(requestToAddGroupToParent(parentId, childId))
  }
}

// export function mergeProps (stateProps, dispatchProps, ownProps) {
//   // const { slug, groups, sortBy, search } = stateProps

//   return {
//     ...stateProps,
//     ...dispatchProps,
//     ...ownProps
//   }
// }

export default connect(mapStateToProps, mapDispatchToProps)
