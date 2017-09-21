import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getSubscribedCommunityTopics } from './TopicNavigation.store'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { removePostFromUrl } from 'util/index'
import { FETCH_POSTS } from 'store/constants'
import { makeDropQueryResults } from 'store/reducers/queryResults'

export function mapStateToProps (state, props) {
  return {
    feedListProps: state.FeedList.feedListProps,
    communityTopics: getSubscribedCommunityTopics(state, props)
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
  const { feedListProps, communityTopics } = stateProps
  const { clearBadge, expand, dropPostResultsMaker, goBack } = dispatchProps
  return {
    ...ownProps,
    communityTopics,
    clearBadge,
    expand,
    goBack,
    clearFeedList: dropPostResultsMaker(feedListProps)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
