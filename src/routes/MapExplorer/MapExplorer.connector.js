import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { get, pick } from 'lodash/fp'
import { FETCH_POSTS_MAP } from 'store/constants'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import presentPost from 'store/presenters/presentPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { addQuerystringToPath, baseUrl, postUrl } from 'util/navigation'

import {
  fetchPosts,
  storeFetchPostsParam,
  storeClientFilterParams,
  getSortedFilteredPosts,
  getCurrentTopics
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

  // TODO: maybe filtering should happen on the presentedPosts? since we do some of that presentation in the filtering code, like calling topics.toModelArray in the filters for every post each time
  const posts = getSortedFilteredPosts(state, fetchPostsParam).map(p => presentPost(p, communityId))
  const topics = getCurrentTopics(state, fetchPostsParam)

  // const hasMore = getHasMorePosts(state, fetchPostsParam)

  return {
    fetchPostsParam,
    filters: state.MapExplorer.clientFilterParams,
    // hasMore,
    pending: state.pending[FETCH_POSTS_MAP],
    posts,
    querystringParams,
    routeParams,
    topics
  }
}

export function mapDispatchToProps (dispatch, props) {
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['showDrawer', 't'], null, props)
  return {
    fetchPosts: param => offset => dispatch(fetchPosts({ offset, ...param })),
    showDetails: (postId) => dispatch(push(postUrl(postId, { ...routeParams, view: 'map' }, querystringParams))),
    toggleDrawer: (visible) => dispatch(push(addQuerystringToPath(baseUrl({ ...routeParams, view: 'map' }), { ...querystringParams, showDrawer: visible }))),
    storeFetchPostsParam: param => opts => dispatch(storeFetchPostsParam({ ...param, ...opts })),
    storeClientFilterParams: params => dispatch(storeClientFilterParams(params))
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
