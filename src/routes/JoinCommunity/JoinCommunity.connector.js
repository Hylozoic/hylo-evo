import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { isNil } from 'lodash'
import getQueryParam from 'store/selectors/getQueryParam'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import {
  getNewMembership, getValidInvite, useInvitation, checkInvitation
} from './JoinCommunity.store'

export function mapStateToProps (state, props) {
  const newMembership = getNewMembership(state)
  const isValidInvite = getValidInvite(state)
  return {
    currentUser: getMe(state),
    invitationToken: getQueryParam('token', state, props),
    accessCode: getParam('accessCode', state, props),
    communitySlug: get('community.slug', newMembership),
    isLoggedIn: getIsLoggedIn(state),
    hasCheckedValidInvite: !isNil(isValidInvite),
    isValidInvite
  }
}

export const mapDispatchToProps = {
  fetchForCurrentUser,
  useInvitation,
  checkInvitation
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { invitationToken, accessCode } = stateProps
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    checkInvitation: () =>
      dispatchProps.checkInvitation({invitationToken, accessCode}),
    useInvitation: (userId) =>
      dispatchProps.useInvitation(userId, {invitationToken, accessCode})
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
