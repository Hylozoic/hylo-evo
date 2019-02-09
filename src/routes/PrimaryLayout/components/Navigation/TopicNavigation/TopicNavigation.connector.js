import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { get } from 'lodash/fp'
import { getSubscribedCommunityTopics } from './TopicNavigation.store'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { removePostFromUrl } from 'util/navigation'
import { FETCH_POSTS } from 'store/constants'
import { makeDropQueryResults } from 'store/reducers/queryResults'

export function mapStateToProps (state, props) {
  const communityTopics = getSubscribedCommunityTopics(state, props)

  return {
    feedListFetchPostsParam: get('FeedList.fetchPostsParam', state),
    communityTopics
  }
}

const dropPostResults = makeDropQueryResults(FETCH_POSTS)

export function mapDispatchToProps (dispatch, props) {
  return {
    clearBadge: id => dispatch(resetNewPostCount(id, 'CommunityTopic')),
    dropPostResultsMaker: props => () => dispatch(dropPostResults(props)),
    expand: () => {
      if (props.collapsed) {
        return dispatch(push(removePostFromUrl(window.location.pathname)))
      }
    },
    goBack: event => {
      // this action is assigned to an element inside a link, so preventDefault
      // stops the link from being clicked
      event.preventDefault()
      return dispatch(push(props.backUrl))
    }
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { feedListFetchPostsParam, communityTopics } = stateProps
  const { clearBadge, expand, dropPostResultsMaker, goBack } = dispatchProps
  return {
    ...ownProps,
    communityTopics,
    clearBadge,
    expand,
    goBack,
    clearFeedList: dropPostResultsMaker(feedListFetchPostsParam)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
