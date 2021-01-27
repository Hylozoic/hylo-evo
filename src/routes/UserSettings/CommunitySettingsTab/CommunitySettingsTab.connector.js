import get from 'lodash/get'
import { connect } from 'react-redux'
import { createAffiliation, deleteAffiliation, leaveCommunity } from './CommunitySettingsTab.store'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getCurrentUserMemberships from 'store/selectors/getCurrentUserMemberships'
import orm from 'store/models'

export const getCurrentUserAffiliations = ormCreateSelector(
  orm,
  state => state.orm,
  session => {
    return session.Me.first().affiliations
  }
)

export function mapStateToProps (state, props) {
  const action = get(state, 'CommunitySettingsTab.action')
  const affiliations = getCurrentUserAffiliations(state, props)
  const memberships = getCurrentUserMemberships(state, props)

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
    leaveCommunity: (params) => dispatch(leaveCommunity(params))
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
