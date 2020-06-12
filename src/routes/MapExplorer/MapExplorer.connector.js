import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { get, pick } from 'lodash/fp'
import { FETCH_POSTS_MAP } from 'store/constants'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import presentPost from 'store/presenters/presentPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getMe from 'store/selectors/getMe'
import { addQuerystringToPath, baseUrl, personUrl, postUrl } from 'util/navigation'

import {
  fetchMembers,
  fetchPosts,
  storeFetchPostsParam,
  storeClientFilterParams,
  getSortedFilteredMembers,
  getSortedFilteredPosts,
  getCurrentTopics
} from './MapExplorer.store.js'

export function presentMember (person, communityId) {
  return {
    ...pick([ 'id', 'name', 'avatarUrl', 'locationObject' ], person.ref),
    community: person.memberships.first()
      ? person.memberships.first().community.name : null
  }
}

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const communityId = community && community.id
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

  const fetchMembersParam = {
    subject,
    ...pick([
      'slug',
      'networkSlug'
    ], routeParams),
    ...pick([
      // TODO: these are actually not being queried by on the server, remove for now?
      'sortBy',
      'topic'
    ], props),
    boundingBox: state.MapExplorer.fetchPostsParam ? state.MapExplorer.fetchPostsParam.boundingBox : null
  }

  const fetchPostsParam = {
    subject,
    ...pick([
      'slug',
      'networkSlug'
    ], routeParams),
    ...pick([
      // TODO: these are actually not being queried by on the server, remove for now?
      'sortBy',
      'topic'
    ], props),
    boundingBox: state.MapExplorer.fetchPostsParam ? state.MapExplorer.fetchPostsParam.boundingBox : null
  }

  // TODO: maybe filtering should happen on the presentedPosts? since we do some of that presentation in the filtering code, like calling topics.toModelArray in the filters for every post each time
  const members = getSortedFilteredMembers(state, fetchMembersParam).map(m => presentMember(m, communityId))
  const posts = getSortedFilteredPosts(state, fetchPostsParam).map(p => presentPost(p, communityId))
  const topics = getCurrentTopics(state, fetchPostsParam)

  const me = getMe(state)
  const centerLocation = community && community.locationObject ? community.locationObject.center
    : me.locationObject ? me.locationObject.center
      : { lat: 35.442845, lng: 7.916598 }
  const zoom = centerLocation ? 10 : 0

  return {
    centerLocation,
    fetchMembersParam,
    fetchPostsParam,
    filters: state.MapExplorer.clientFilterParams,
    members,
    // TODO: show loading spinner while pending
    pending: state.pending[FETCH_POSTS_MAP],
    posts,
    querystringParams,
    routeParams,
    topics,
    zoom
  }
}

export function mapDispatchToProps (dispatch, props) {
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['showDrawer', 't'], null, props)
  return {
    fetchMembers: (params) => () => dispatch(fetchMembers({ ...params })),
    fetchPosts: (params) => () => dispatch(fetchPosts({ ...params })),
    showDetails: (postId) => dispatch(push(postUrl(postId, { ...routeParams, view: 'map' }, querystringParams))),
    gotoMember: (memberId) => dispatch(push(personUrl(memberId, routeParams.slug, routeParams.networkSlug))),
    toggleDrawer: (visible) => dispatch(push(addQuerystringToPath(baseUrl({ ...routeParams, view: 'map' }), querystringParams))),
    storeFetchPostsParam: param => opts => dispatch(storeFetchPostsParam({ ...param, ...opts })),
    storeClientFilterParams: params => dispatch(storeClientFilterParams(params))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchMembersParam, fetchPostsParam } = stateProps
  const { fetchMembers, fetchPosts, storeFetchPostsParam } = dispatchProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchMembers: fetchMembers(fetchMembersParam),
    fetchPosts: fetchPosts(fetchPostsParam),
    storeFetchPostsParam: storeFetchPostsParam(fetchPostsParam)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
