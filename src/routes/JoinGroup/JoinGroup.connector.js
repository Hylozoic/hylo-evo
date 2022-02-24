import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { isNil } from 'lodash'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import {
  getNewMembership, getValidInvite, useInvitation, checkInvitation
} from './JoinGroup.store'

export function mapStateToProps (state, props) {
  const newMembership = getNewMembership(state)
  const isValidInvite = getValidInvite(state)
  return {
    accessCode: getRouteParam('accessCode', state, props),
    currentUser: getMe(state),
    groupSlug: get('group.slug', newMembership),
    hasCheckedValidInvite: !isNil(isValidInvite),
    isLoggedIn: getIsLoggedIn(state),
    invitationToken: getQuerystringParam('token', state, props),
    isValidInvite,
    redirectToView: getQuerystringParam('redirectToView', state, props)
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
      dispatchProps.checkInvitation({ invitationToken, accessCode }),
    useInvitation: () =>
      dispatchProps.useInvitation({ invitationToken, accessCode })
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
