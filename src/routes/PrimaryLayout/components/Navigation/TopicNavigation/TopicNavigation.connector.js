import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getSubscribedCommunityTopics } from './TopicNavigation.store'
import fetchCommunityTopics from 'store/actions/fetchCommunityTopics'
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
    ...bindActionCreators({
      fetchCommunityTopics
    }, dispatch),
    clearBadge: id =>
      dispatch(resetNewPostCount(id, 'CommunityTopic'))
  }
}

export function mergeProps (sProps, dProps, ownProps) {
  const { community } = sProps
  return {
    ...sProps,
    ...dProps,
    ...ownProps,
    fetchCommunityTopics: () => dProps.fetchCommunityTopics(community.id, true)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
