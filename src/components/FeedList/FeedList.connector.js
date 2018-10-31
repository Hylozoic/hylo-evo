import { connect } from 'react-redux'
import { pick } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import { presentPost } from 'store/selectors/getPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import {
  fetchPosts,
  storeFetchPostsParam,
  getPosts,
  getHasMorePosts
} from './FeedList.store.js'

export function mapStateToProps (state, props) {
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const communityId = currentCommunity && currentCommunity.id
  const fetchPostsParam = {
    filter: props.postTypeFilter,
    ...pick([
      'subject',
      'slug',
      'networkSlug',
      'sortBy',
      'topic'
    ], props)
  }
  // NOTE: In effort to better seperate the query caching from component details
  //       it's better (and necessary) in this case to send the fetch param then
  //       the raw props of the component.
  const posts = getPosts(state, fetchPostsParam).map(p => presentPost(p, communityId))
  const hasMore = getHasMorePosts(state, fetchPostsParam)

  return {
    posts,
    hasMore,
    fetchPostsParam,
    pending: state.pending[FETCH_POSTS]
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    fetchPosts: param => offset => dispatch(fetchPosts({offset, ...param})),
    storeFetchPostsParam: param => () => dispatch(storeFetchPostsParam(param))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchPostsParam } = stateProps
  const { fetchPosts, storeFetchPostsParam } = dispatchProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchPosts: fetchPosts(fetchPostsParam),
    storeFetchPostsParam: storeFetchPostsParam(fetchPostsParam)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
