import { connect } from 'react-redux'
import { getSubscribedCommunityTopics } from './TopicNavigation.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { push } from 'react-router-redux'
import { removePostFromUrl } from 'util/index'

export function mapStateToProps (state, props) {
  return {
    community: getCommunityForCurrentRoute(state, props),
    communityTopics: getSubscribedCommunityTopics(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    clearBadge: id => dispatch(resetNewPostCount(id, 'CommunityTopic')),
    expand: () => {
      if (props.collapsed) {
        return dispatch(push(removePostFromUrl(window.location.pathname)))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
