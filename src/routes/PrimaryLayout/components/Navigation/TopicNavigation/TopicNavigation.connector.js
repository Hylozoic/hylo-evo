import { connect } from 'react-redux'
import {
  fetchCommunityTopicSubscriptions, getTopicSubscriptions
} from './TopicNavigation.store'

export function mapStateToProps (state, props) {
  const subscriptions = getTopicSubscriptions(state, props)
  console.log('subscriptions', subscriptions)
  return {
    subscriptions: subscriptions
  }
}

export function mapDispatchToProps (dispatch, { slug }) {
  return {
    fetchSubscriptions: slug
      ? () => dispatch(fetchCommunityTopicSubscriptions(slug))
      : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
