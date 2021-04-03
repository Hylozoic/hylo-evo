import get from 'lodash/get'
import { connect } from 'react-redux'
import { createAffiliation, deleteAffiliation, leaveGroup } from './UserGroupsTab.store'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getMyMemberships from 'store/selectors/getMyMemberships'
import orm from 'store/models'

export const getCurrentUserAffiliations = ormCreateSelector(
  orm,
  session => {
    return session.Me.first().affiliations
  }
)

export function mapStateToProps (state, props) {
  const action = get(state, 'UserGroupsTab.action')
  const affiliations = getCurrentUserAffiliations(state, props)
  const memberships = getMyMemberships(state, props).sort((a, b) => a.group.name.localeCompare(b.group.name))

  return {
    action,
    affiliations,
    memberships
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    createAffiliation: (params) => dispatch(createAffiliation(params)),
    deleteAffiliation: (params) => dispatch(deleteAffiliation(params)),
    leaveGroup: (params) => dispatch(leaveGroup(params))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
