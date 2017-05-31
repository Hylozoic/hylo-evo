import { connect } from 'react-redux'
import { getSubscribedCommunityTopics } from './TopicNavigation.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import resetNewPostCount from 'store/actions/resetNewPostCount'

export function mapStateToProps (state, props) {
  return {
    community: getCommunityForCurrentRoute(state, props),
    communityTopics: getSubscribedCommunityTopics(state, props)
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    clearBadge: id => dispatch(resetNewPostCount(id, 'CommunityTopic'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
