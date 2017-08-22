import { connect } from 'react-redux'
import { origin } from 'util/index'
import { regenerateAccessCode, FETCH_COMMUNITY_SETTINGS } from '../CommunitySettings.store'
// import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { community } = props
  const pending = state.pending[FETCH_COMMUNITY_SETTINGS]
  const inviteLink = origin() + community.invitePath
  const pendingInvites = [{email: 'john.doe@gmail.com', id: 1, date: new Date()}, {email: 'jo222222doe@gmail.com', id: 2, date: new Date(Date.parse('March 21, 2017'))}, {email: 'j333@gmail.com', id: 3, date: new Date(Date.parse('July 21, 2017'))}]
  return {
    inviteLink,
    pending,
    pendingInvites
  }
}

export const mapDispatchToProps = {
  regenerateAccessCode
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { community: { id } } = ownProps
  const regenerateAccessCode = () => dispatchProps.regenerateAccessCode(id)
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    regenerateAccessCode
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
