import { connect } from 'react-redux'
import { communityJoinUrl } from 'util/index'
import { regenerateAccessCode } from '../CommunitySettings.store'
// import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { community } = props
  const inviteLink = communityJoinUrl(community)
  return {
    inviteLink
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
