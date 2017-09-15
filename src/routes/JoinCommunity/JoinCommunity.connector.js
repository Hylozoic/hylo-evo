import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { isNil } from 'lodash'
import getQueryParam from 'store/selectors/getQueryParam'
import getMe from 'store/selectors/getMe'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import { fetchForCurrentUser } from 'routes/PrimaryLayout/PrimaryLayout.store'
import {
  getNewMembership, getValidToken, useInvitation, checkInvitation
} from './JoinCommunity.store'

export function mapStateToProps (state, props) {
  const newMembership = getNewMembership(state)
  const validToken = getValidToken(state)
  return {
    currentUser: getMe(state),
    invitationToken: getQueryParam('token', state, props),
    communitySlug: get('community.slug', newMembership),
    isLoggedIn: getIsLoggedIn(state),
    hasCheckedValidToken: !isNil(validToken),
    validToken
  }
}

export const mapDispatchToProps = {
  fetchForCurrentUser,
  useInvitation,
  checkInvitation
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    useInvitation: (userId) =>
      dispatchProps.useInvitation(userId, stateProps.invitationToken),
    checkInvitation: () =>
      dispatchProps.checkInvitation(stateProps.invitationToken)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
