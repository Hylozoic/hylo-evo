import { connect } from 'react-redux'
import toggleCommunityTopicSubscribe from 'store/actions/toggleCommunityTopicSubscribe'

const mapDispatchToProps = {toggleCommunityTopicSubscribe}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { topic, community, communityTopic } = ownProps
  return {
    ...dispatchProps,
    ...ownProps,
    toggleSubscribe: () =>
      dispatchProps.toggleCommunityTopicSubscribe(topic.id, community.id, !communityTopic.isSubscribed)
  }
}

export default connect(null, mapDispatchToProps, mergeProps)
