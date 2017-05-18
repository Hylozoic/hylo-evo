import { connect } from 'react-redux'
import toggleTopicSubscribe from 'store/actions/toggleTopicSubscribe'
import getTopicSubscription from 'store/selectors/getTopicSubscription'

export function mapStateToProps (state, props) {
  return {
    subscription: getTopicSubscription(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { topic, community } = props
  const topicId = topic && topic.id
  const communityId = community && community.id
  return {
    toggleSubscribeMaker: subscription => topicId && communityId
      ? () => dispatch(toggleTopicSubscribe(topicId, communityId, subscription))
      : () => {}
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { subscription } = stateProps
  const { toggleSubscribeMaker } = dispatchProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    toggleSubscribe: toggleSubscribeMaker(subscription)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
