import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { get, pick } from 'lodash/fp'
import { FETCH_POSTS_MAP } from 'store/constants'
import getRouteParam from 'store/selectors/getRouteParam'
import {
  fetchSavedSearches, deleteSearch
} from '../UserSettings/UserSettings.store'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import presentPost from 'store/presenters/presentPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getMe from 'store/selectors/getMe'
import { addQuerystringToPath, baseUrl, personUrl, postUrl, communityMapDetailUrl } from 'util/navigation'

import {
  fetchMembers,
  fetchPosts,
  fetchPublicCommunities,
  getPublicCommunities,
  getSortedFilteredMembers,
  getSortedFilteredPosts,
  getCurrentTopics,
  storeFetchParams,
  storeClientFilterParams
} from './MapExplorer.store.js'

export function presentMember (person, communityId) {
  return {
    ...pick([ 'id', 'name', 'avatarUrl', 'locationObject', 'tagline', 'skills' ], person.ref),
    type: 'member',
    skills: person.skills.toModelArray(),
    community: person.memberships.first()
      ? person.memberships.first().community.name : null
  }
}

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const communityId = community && community.id
  const routeParams = get('match.params', props)
  const slug = getRouteParam('slug', state, props)
  const context = getRouteParam('context', state, props)
  const networkSlug = getRouteParam('networkSlug', state, props)
  const networkSlugs = getQuerystringParam('network', state, props)
  const hideDrawer = getQuerystringParam('hideDrawer', state, props) === 'true'

  var subject
  if (context === 'public') {
    subject = 'public'
  } else if (slug) {
    subject = 'community'
  } else if (networkSlug) {
    subject = 'network'
  } else {
    subject = 'all'
  }

  const fetchParams = {
    subject,
    slug,
    networkSlug,
    networkSlugs, // networkSlug used by network posts query, networkSlugs uses by public posts query
    boundingBox: state.MapExplorer.fetchParams ? state.MapExplorer.fetchParams.boundingBox : null,
    isPublic: subject === 'public' // only needed to track which query results to pull for the map
  }

  // TODO: maybe filtering should happen on the presentedPosts? since we do some of that presentation in the filtering code, like calling topics.toModelArray in the filters for every post each time
  const members = getSortedFilteredMembers(state, fetchParams).map(m => presentMember(m, communityId))
  const posts = getSortedFilteredPosts(state, fetchParams).map(p => presentPost(p, communityId))
  const topics = getCurrentTopics(state, fetchParams)
  const publicCommunities = getPublicCommunities(state, fetchParams)

  const me = getMe(state)
  const centerLocation = community && community.locationObject ? community.locationObject.center : me && me.locationObject ? me.locationObject.center : null

  return {
    centerLocation: centerLocation || { lat: 35.442845, lng: 7.916598 },
    currentUser: me,
    fetchParams,
    filters: state.MapExplorer.clientFilterParams,
    members,
    pending: state.pending[FETCH_POSTS_MAP],
    posts,
    publicCommunities,
    routeParams,
    hideDrawer,
    searches: state.SavedSearches.searches,
    topics,
    zoom: centerLocation ? 10 : 0
  }
}

export function mapDispatchToProps (dispatch, props) {
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['hideDrawer', 't', 'network'], null, props)
  return {
    fetchMembers: (params) => () => dispatch(fetchMembers({ ...params })),
    fetchPosts: (params) => () => dispatch(fetchPosts({ ...params })),
    fetchPublicCommunities: (params) => () => dispatch(fetchPublicCommunities({ ...params })),
    fetchSavedSearches: (userId) => () => dispatch(fetchSavedSearches(userId)),
    deleteSearch: (searchId) => dispatch(deleteSearch(searchId)),
    showDetails: (postId) => dispatch(push(postUrl(postId, { ...routeParams, view: 'map' }, querystringParams))),
    showCommunityDetails: (communityId) => dispatch(push(communityMapDetailUrl(communityId, { ...routeParams, view: 'map' }, querystringParams))),
    gotoMember: (memberId) => dispatch(push(personUrl(memberId, routeParams.slug, routeParams.networkSlug))),
    toggleDrawer: (hidden) => dispatch(push(addQuerystringToPath(baseUrl({ ...routeParams, view: 'map' }), { ...querystringParams, hideDrawer: hidden }))),
    storeFetchParams: param => opts => dispatch(storeFetchParams({ ...param, ...opts })),
    storeClientFilterParams: params => dispatch(storeClientFilterParams(params))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchParams, currentUser } = stateProps
  const { fetchMembers, fetchPosts, fetchPublicCommunities, storeFetchParams, fetchSavedSearches } = dispatchProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchMembers: fetchMembers(fetchParams),
    fetchPublicCommunities: fetchPublicCommunities(fetchParams),
    fetchPosts: fetchPosts(fetchParams),
    fetchSavedSearches: fetchSavedSearches(currentUser.id),
    storeFetchParams: storeFetchParams(fetchParams)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
