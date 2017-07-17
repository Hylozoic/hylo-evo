import { connect } from 'react-redux'
import { getSubscribedCommunityTopics } from './TopicNavigation.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { push } from 'react-router-redux'
import { removePostFromUrl, communityUrl, allCommunitiesUrl } from 'util/index'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const communitySlug = community ? community.slug : null
  const backUrl = community ? communityUrl(communitySlug) : allCommunitiesUrl()
  return {
    communityTopics: getSubscribedCommunityTopics(state, props),
    communitySlug,
    backUrl,
    clearFeedList: state.FeedList.clearFeedList
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
