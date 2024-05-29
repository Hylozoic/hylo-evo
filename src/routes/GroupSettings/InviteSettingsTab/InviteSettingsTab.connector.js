import { connect } from 'react-redux'
import { origin } from 'util/navigation'
import { regenerateAccessCode, FETCH_GROUP_SETTINGS } from '../GroupSettings.store'
import trackAnalyticsEvent from 'store/actions/trackAnalyticsEvent'
import getMe from 'store/selectors/getMe'
import {
  allowGroupInvites,
  createInvitations,
  getPendingInvites,
  expireInvitation,
  resendInvitation,
  reinviteAll
} from './InviteSettingsTab.store'

export function mapStateToProps (state, props) {
  const { group } = props
  const pending = state.pending[FETCH_GROUP_SETTINGS]
  const inviteLink = origin() + group.invitePath
  const pendingInvites = getPendingInvites(state, { groupId: group.id })

  return {
    inviteLink,
    pending,
    pendingInvites
  }
}

export function mapDispatchToProps (dispatch, props) {
  const groupId = props.group.id

  return {
    regenerateAccessCode: () => dispatch(regenerateAccessCode(groupId)),
    createInvitations: (emails, message) => dispatch(createInvitations(groupId, emails, message)),
    expireInvitation: (invitationToken) => dispatch(expireInvitation(invitationToken)),
    resendInvitation: (invitationToken) => dispatch(resendInvitation(invitationToken)),
    reinviteAll: () => dispatch(reinviteAll(groupId)),
    allowGroupInvites: (groupId, settingBoolean) => dispatch(allowGroupInvites(groupId, settingBoolean)),
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
