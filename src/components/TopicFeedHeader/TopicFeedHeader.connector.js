import { connect } from 'react-redux'
import toggleTopicSubscribe from 'store/actions/toggleTopicSubscribe'

const mapDispatchToProps = {toggleTopicSubscribe}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { topic, community, communityTopic } = ownProps
  return {
    ...dispatchProps,
    ...ownProps,
    toggleSubscribe: () =>
      dispatchProps.toggleTopicSubscribe(topic.id, community.id, !communityTopic.isSubscribed)
  }
}

export default connect(null, mapDispatchToProps, mergeProps)
