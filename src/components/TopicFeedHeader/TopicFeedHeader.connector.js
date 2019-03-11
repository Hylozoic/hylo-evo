import { connect } from 'react-redux'
import toggleCommunityTopicSubscribe from 'store/actions/toggleCommunityTopicSubscribe'

const mapDispatchToProps = {
  toggleCommunityTopicSubscribe
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...dispatchProps,
    ...ownProps,
    toggleSubscribe: communityTopic => dispatchProps.toggleCommunityTopicSubscribe(communityTopic)
  }
}

export default connect(null, mapDispatchToProps, mergeProps)
