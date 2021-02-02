import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { get } from 'lodash/fp'
import { getTopicsFromSubscribedGroupTopics } from './TopicNavigation.store'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { topicsUrl, removePostFromUrl, allGroupsUrl } from 'util/navigation'
import { FETCH_POSTS } from 'store/constants'
import { makeDropQueryResults } from 'store/reducers/queryResults'

export function mapStateToProps (state, props) {
  const { routeParams } = props
  const topics = getTopicsFromSubscribedGroupTopics(state, props)

  return {
    feedListFetchPostsParam: get('FeedList.fetchPostsParam', state),
    seeAllUrl: topicsUrl(routeParams, allGroupsUrl()),
    routeParams,
    topics
  }
}

const dropPostResults = makeDropQueryResults(FETCH_POSTS)

export function mapDispatchToProps (dispatch, props) {
  return {
    clearBadge: id => dispatch(resetNewPostCount(id, 'GroupTopic')),
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
