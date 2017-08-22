import { connect } from 'react-redux'
import { origin } from 'util/index'
import { regenerateAccessCode, FETCH_COMMUNITY_SETTINGS } from '../CommunitySettings.store'
// import getMe from 'store/selectors/getMe'
import { createInvitations, getPendingInvites, expireInvitation, resendInvitation, reinviteAll } from './InviteSettingsTab.store'

export function mapStateToProps (state, props) {
  const { community } = props
  const pending = state.pending[FETCH_COMMUNITY_SETTINGS]
  const inviteLink = origin() + community.invitePath
  const pendingInvites = getPendingInvites(state, { communityId: community.id })

  return {
    inviteLink,
    pending,
    pendingInvites
  }
}

export function mapDispatchToProps (dispatch, props) {
  const communityId = props.community.id

  return {
    regenerateAccessCode: () => dispatch(regenerateAccessCode(communityId)),
    createInvitations: (emails, message) => dispatch(createInvitations(communityId, emails, message)),
    expireInvitation: (invitationId) => dispatch(expireInvitation(invitationId)),
    resendInvitation: (invitationId) => dispatch(resendInvitation(invitationId)),
    reinviteAll: () => dispatch(reinviteAll(communityId))
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
