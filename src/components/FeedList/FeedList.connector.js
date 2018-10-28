import { connect } from 'react-redux'
import { pick } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import { presentPost } from 'store/selectors/getPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import {
  fetchPosts,
  storeFetchPostsParam,
  getPosts,
  getHasMorePosts,
} from './FeedList.store.js'

export function mapStateToProps (state, props) {
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const communityId = currentCommunity && currentCommunity.id
  const posts = getPosts(state, props).map(p => presentPost(p, communityId))
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

  return {
    posts,
    fetchPostsParam,
    hasMore: getHasMorePosts(state, props),
    pending: state.pending[FETCH_POSTS]
  }
}

export const mapDispatchToProps = function (dispatch) {
  return {
    fetchPosts: param => (offset) => dispatch(fetchPosts({offset, ...param})),
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
    // We are putting the fetchPostsParam into appstate so components (ie Navigation,
    // TopicNav) can drop the queryResults and re-fetch posts
    storeFetchPostsParam: storeFetchPostsParam(fetchPostsParam)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
