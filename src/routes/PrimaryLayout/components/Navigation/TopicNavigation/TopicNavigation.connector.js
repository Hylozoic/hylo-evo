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

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community } = stateProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchCommunityTopics: () =>
      dispatchProps.fetchCommunityTopics(community.id, true)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
