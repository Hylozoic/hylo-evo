import { connect } from 'react-redux'
import { getSubscribedCommunityTopics } from './TopicNavigation.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { get } from 'lodash/fp'

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

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community } = stateProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchCommunityTopics: () =>
      dispatchProps.fetchCommunityTopics(get('id', community), {subscribed: true})
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
