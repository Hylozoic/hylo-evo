import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getSubscribedCommunityTopics } from './TopicNavigation.store'
import fetchCommunityTopics from 'store/actions/fetchCommunityTopics'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  return {
    community,
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
      dispatchProps.fetchCommunityTopics(get('id', community), true)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
