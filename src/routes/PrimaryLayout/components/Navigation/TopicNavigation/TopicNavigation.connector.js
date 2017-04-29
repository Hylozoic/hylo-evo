import { connect } from 'react-redux'
import {
  fetchCommunity, getTopicSubscriptions
} from './TopicNavigation.store'

export function mapStateToProps (state, props) {
  return {
    topics: getTopicSubscriptions(state, props)
  }
}

export function mapDispatchToProps (dispatch, { slug }) {
  return {
    fetchCommunity: slug ? () => dispatch(fetchCommunity(slug)) : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
