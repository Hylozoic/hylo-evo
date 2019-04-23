import { connect } from 'react-redux'
import { pick } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import presentPost from 'store/presenters/presentPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getHolochainActive from 'store/selectors/getHolochainActive'
import holochainFetchPosts from 'store/actions/holochainFetchPosts'

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
      'slug',
      'networkSlug'
    ], props.routeParams),
    ...pick([
      'subject',
      'sortBy',
      'topic'
    ], props)
  }
  // NOTE: In effort to better seperate the query caching from component details
  //       it's better (and necessary) in this case to send the fetch param then
  //       the raw props of the component.
  const posts = getPosts(state, fetchPostsParam).map(p => presentPost(p, communityId))
  const hasMore = getHasMorePosts(state, fetchPostsParam)
  const holochainActive = getHolochainActive(state)

  return {
    holochainActive,
    posts,
    hasMore,
    fetchPostsParam,
    pending: state.pending[FETCH_POSTS]
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    fetchPosts: param => offset => dispatch(fetchPosts({ offset, ...param })),
    storeFetchPostsParam: param => () => dispatch(storeFetchPostsParam(param)),
    holochainFetchPosts: param => dispatch(holochainFetchPosts(param))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchPostsParam, holochainActive } = stateProps
  const { storeFetchPostsParam } = dispatchProps

  const fetchPosts = holochainActive
    ? () => dispatchProps.holochainFetchPosts(fetchPostsParam)
    : dispatchProps.fetchPosts(fetchPostsParam)

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchPosts,
    storeFetchPostsParam: storeFetchPostsParam(fetchPostsParam)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
