import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { groupUrl, postUrl } from 'util/navigation'
import fetchGroup from 'store/actions/fetchGroupBySlug'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getRouteParam from 'store/selectors/getRouteParam'
import presentGroup from 'store/presenters/presentGroup'
import presentPost from 'store/presenters/presentPost'
import { fetchPosts, getPosts } from 'components/FeedList/FeedList.store'

export function mapStateToProps (state, props) {
  let group, fetchPostsParam, posts
  const groupSlug = getRouteParam('groupSlug', state, props)
  const routeParams = props.match.params
  
  if (groupSlug) {
    group = presentGroup(getGroupForCurrentRoute(state, props))
    fetchPostsParam = { slug: groupSlug, context: 'groups'}
    posts = getPosts(state, fetchPostsParam).map(p => presentPost(p, group.id))
  }

  return {
    fetchPostsParam,
    group,
    posts,
    routeParams
  }
}

export function mapDispatchToProps (dispatch, props) {
  const groupSlug = getRouteParam('groupSlug', {}, props)
  const url = `${groupUrl(groupSlug)}/about`

  return {
    fetchGroup: () => dispatch(fetchGroup(groupSlug)),
    fetchPosts: param => offset => {
      // The topic was not found in this case
      if (param.topicName && !param.topic) return
      return dispatch(fetchPosts({ offset, ...param }))
    },
    showAbout: async () => {
      await fetchGroup(groupSlug)
      dispatch(push(url))
    },
    showDetails: (postId) => dispatch(push(postUrl(postId, { groupSlug }))),
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchPostsParam } = stateProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchPosts: dispatchProps.fetchPosts(fetchPostsParam),
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
