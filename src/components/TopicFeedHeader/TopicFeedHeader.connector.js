import { connect } from 'react-redux'
import toggleTopicSubscribe from 'store/actions/toggleTopicSubscribe'

const mapDispatchToProps = {toggleTopicSubscribe}

export const mergeProps = (sProps, dProps, ownProps) => {
  const { topic, community, communityTopic } = ownProps
  return {
    ...dProps,
    ...ownProps,
    toggleSubscribe: () =>
      dProps.toggleTopicSubscribe(topic.id, community.id, !communityTopic.isSubscribed)
  }
}

export default connect(null, mapDispatchToProps, mergeProps)
