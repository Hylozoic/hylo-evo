import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { pick } from 'lodash/fp'
import { FETCH_POSTS_MAP } from 'store/constants'
import presentPost from 'store/presenters/presentPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { postUrl } from 'util/navigation'

import {
  fetchPosts,
  storeFetchPostsParam,
  getPosts,
  getHasMorePosts
} from './MapExplorer.store.js'

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
    ], props),
    boundingBox: state.MapExplorer.fetchPostsParam ? state.MapExplorer.fetchPostsParam.boundingBox : null
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
    pending: state.pending[FETCH_POSTS_MAP]
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchPosts: param => offset => dispatch(fetchPosts({ offset, ...param })),
    showDetails: (postId) => dispatch(push(postUrl(postId, { ...props.routeParams, view: 'map' }, props.querystringParams))),
    storeFetchPostsParam: param => (boundingBox = null) => dispatch(storeFetchPostsParam({ ...param, boundingBox }))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchPostsParam } = stateProps
  const { storeFetchPostsParam } = dispatchProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchPosts: dispatchProps.fetchPosts(fetchPostsParam),
    storeFetchPostsParam: storeFetchPostsParam(fetchPostsParam)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
