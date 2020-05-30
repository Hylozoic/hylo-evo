import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { get, pick } from 'lodash/fp'
import { FETCH_POSTS_MAP } from 'store/constants'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import presentPost from 'store/presenters/presentPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { postUrl } from 'util/navigation'

import {
  fetchPosts,
  storeFetchPostsParam,
  getPostsByBoundingBox
  // getHasMorePosts
} from './MapExplorer.store.js'

export function mapStateToProps (state, props) {
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const communityId = currentCommunity && currentCommunity.id
  const routeParams = get('match.params', props)
  const { slug, networkSlug } = routeParams

  const querystringParams = getQuerystringParam(['showDrawer', 't'], null, props)

  var subject
  if (slug) {
    subject = 'community'
  } else if (networkSlug) {
    subject = 'network'
  } else {
    subject = 'all-communities'
  }

  const fetchPostsParam = {
    filter: props.postTypeFilter,
    subject,
    ...pick([
      'slug',
      'networkSlug'
    ], routeParams),
    ...pick([
      // TODO: Determine how/where we will determine sortBy and topic, probably from queryParams?
      'sortBy',
      'topic'
    ], props),
    boundingBox: state.MapExplorer.fetchPostsParam ? state.MapExplorer.fetchPostsParam.boundingBox : null
  }
  // NOTE: In effort to better seperate the query caching from component details
  //       it's better (and necessary) in this case to send the fetch param then
  //       the raw props of the component.
  const posts = getPostsByBoundingBox(state, fetchPostsParam).map(p => presentPost(p, communityId))

  // const hasMore = getHasMorePosts(state, fetchPostsParam)

  return {
    posts,
    // hasMore,
    fetchPostsParam,
    pending: state.pending[FETCH_POSTS_MAP],
    routeParams,
    querystringParams
  }
}

export function mapDispatchToProps (dispatch, props) {
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['showDrawer', 't'], null, props)
  return {
    fetchPosts: param => offset => dispatch(fetchPosts({ offset, ...param })),
    showDetails: (postId) => dispatch(push(postUrl(postId, { ...routeParams, view: 'map' }, querystringParams))),
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
