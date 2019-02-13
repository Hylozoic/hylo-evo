import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { get, find } from 'lodash/fp'
import { getTopicsFromSubscribedCommunityTopics } from './TopicNavigation.store'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { topicsUrl, removePostFromUrl, allCommunitiesUrl } from 'util/navigation'
import { FETCH_POSTS } from 'store/constants'
import { makeDropQueryResults } from 'store/reducers/queryResults'

export function mapStateToProps (state, props) {
  const { routeParams } = props
  const topics = getTopicsFromSubscribedCommunityTopics(state, props)

  return {
    feedListFetchPostsParam: get('FeedList.fetchPostsParam', state),
    seeAllUrl: topicsUrl(routeParams, allCommunitiesUrl()),
    routeParams,
    topics
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
  return {
    ...ownProps,
    ...dispatchProps,
    ...stateProps,
    clearFeedList: dispatchProps.dropPostResultsMaker(stateProps.feedListFetchPostsParam)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
