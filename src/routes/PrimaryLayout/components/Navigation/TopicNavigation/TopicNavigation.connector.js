import { connect } from 'react-redux'
import {
  fetchCommunityTopicSubscriptions, getTopicSubscriptions
} from './TopicNavigation.store'

export function mapStateToProps (state, props) {
  return {
    subscriptions: getTopicSubscriptions(state, props)
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
