import { connect } from 'react-redux'
import { origin } from 'util/navigation'
import { regenerateAccessCode, FETCH_COMMUNITY_SETTINGS } from '../CommunitySettings.store'
import trackAnalyticsEvent from 'store/actions/trackAnalyticsEvent'
import getMe from 'store/selectors/getMe'
import {
  allowCommunityInvites,
  createInvitations,
  getPendingInvites,
  expireInvitation,
  resendInvitation,
  reinviteAll
} from './InviteSettingsTab.store'

export function mapStateToProps (state, props) {
  const { community } = props
  const pending = state.pending[FETCH_COMMUNITY_SETTINGS]
  const inviteLink = origin() + community.invitePath
  const pendingInvites = getPendingInvites(state, { communityId: community.id })
  const currentUser = getMe(state, props)
  const canModerate = currentUser && currentUser.canModerate(community)

  return {
    inviteLink,
    pending,
    pendingInvites,
    canModerate
  }
}

export function mapDispatchToProps (dispatch, props) {
  const communityId = props.community.id

  return {
    regenerateAccessCode: () => dispatch(regenerateAccessCode(communityId)),
    createInvitations: (emails, message) => dispatch(createInvitations(communityId, emails, message)),
    expireInvitation: (invitationToken) => dispatch(expireInvitation(invitationToken)),
    resendInvitation: (invitationToken) => dispatch(resendInvitation(invitationToken)),
    reinviteAll: () => dispatch(reinviteAll(communityId)),
    allowCommunityInvites: (communityId, settingBoolean) => dispatch(allowCommunityInvites(communityId, settingBoolean)),
    trackAnalyticsEvent: (eventNames, analyticsData) => dispatch(trackAnalyticsEvent(eventNames, analyticsData))
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
