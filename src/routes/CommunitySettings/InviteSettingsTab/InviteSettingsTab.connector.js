import { connect } from 'react-redux'
import { communityJoinUrl } from 'util/index'
import { regenerateAccessCode, FETCH_COMMUNITY_SETTINGS } from '../CommunitySettings.store'
// import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { community } = props
  const pending = state.pending[FETCH_COMMUNITY_SETTINGS]
  const inviteLink = communityJoinUrl(community)
  return {
    inviteLink,
    pending
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
