import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { get, pick } from 'lodash/fp'
import { FETCH_POSTS_MAP } from 'store/constants'
import getRouteParam from 'store/selectors/getRouteParam'
import {
  fetchSavedSearches, deleteSearch, saveSearch, viewSavedSearch
} from '../UserSettings/UserSettings.store'
import { generateViewParams } from 'util/savedSearch'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import presentPost from 'store/presenters/presentPost'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMe from 'store/selectors/getMe'
import { addQuerystringToPath, baseUrl, personUrl, postUrl, groupDetailUrl } from 'util/navigation'

import {
  fetchMembers,
  fetchPosts,
  fetchGroups,
  getGroups,
  getSortedFilteredMembers,
  getSortedFilteredPosts,
  getCurrentTopics,
  storeFetchParams,
  storeClientFilterParams
} from './MapExplorer.store.js'

export function presentMember (person, groupId) {
  return {
    ...pick([ 'id', 'name', 'avatarUrl', 'locationObject', 'tagline', 'skills' ], person.ref),
    type: 'member',
    skills: person.skills.toModelArray(),
    group: person.memberships.first()
      ? person.memberships.first().group.name : null
  }
}

export function presentGroup (group) {
  return group.ref
}

export function mapStateToProps (state, props) {
  let group = getGroupForCurrentRoute(state, props)
  const routeParams = get('match.params', props)
  const slug = getRouteParam('groupSlug', state, props)
  const context = getRouteParam('context', state, props)
  let groupSlugs = getQuerystringParam('group', state, props)
  const hideDrawer = getQuerystringParam('hideDrawer', state, props) === 'true'
  let groupId
  if (group) {
    group = group.ref
    groupSlugs = (groupSlugs || []).concat(slug)
    groupId = group.id
  }

  const fetchParams = {
    context,
    slug,
    groupSlugs, // used to filter posts by multiple groups
    boundingBox: state.MapExplorer.fetchParams ? state.MapExplorer.fetchParams.boundingBox : null
  }

  const fetchGroupParams = {
    context,
    parentSlugs: groupSlugs, // used to filter posts by multiple groups
    boundingBox: state.MapExplorer.fetchParams ? state.MapExplorer.fetchParams.boundingBox : null
  }

  // TODO: maybe filtering should happen on the presentedPosts? since we do some of that presentation in the filtering code, like calling topics.toModelArray in the filters for every post each time
  const members = getSortedFilteredMembers(state, fetchParams).map(m => presentMember(m, groupId))
  const posts = getSortedFilteredPosts(state, fetchParams).map(p => presentPost(p, groupId))
  const topics = getCurrentTopics(state, fetchParams)
  const groups = getGroups(state, fetchGroupParams).map(g => presentGroup(g))

  const me = getMe(state)
  const centerLocation = group && group.locationObject ? group.locationObject.center : me && me.locationObject ? me.locationObject.center : null

  return {
    centerLocation: centerLocation || { lat: 35.442845, lng: 7.916598 },
    context,
    currentUser: me,
    fetchParams,
    filters: state.MapExplorer.clientFilterParams,
    group,
    groups,
    members,
    pending: state.pending[FETCH_POSTS_MAP],
    posts,
    routeParams,
    hideDrawer,
    searches: state.MapExplorer.searches,
    selectedSearch: state.SavedSearches.selectedSearch,
    topics,
    zoom: centerLocation ? 10 : 0
  }
}

export function mapDispatchToProps (dispatch, props) {
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['hideDrawer', 't', 'group'], null, props)
  return {
    fetchMembers: (params) => () => dispatch(fetchMembers({ ...params })),
    fetchPosts: (params) => () => dispatch(fetchPosts({ ...params })),
    fetchGroups: (params) => () => dispatch(fetchGroups({ ...params })),
    fetchSavedSearches: (userId) => () => dispatch(fetchSavedSearches(userId)),
    deleteSearch: (searchId) => dispatch(deleteSearch(searchId)),
    saveSearch: (params) => dispatch(saveSearch(params)),
    showDetails: (postId) => dispatch(push(postUrl(postId, { ...routeParams, view: 'map' }, querystringParams))),
    showGroupDetails: (groupSlug) => dispatch(push(groupDetailUrl(groupSlug, { ...routeParams, view: 'map' }, querystringParams))),
    gotoMember: (memberId) => dispatch(push(personUrl(memberId, routeParams.groupSlug))),
    toggleDrawer: (hidden) => dispatch(push(addQuerystringToPath(baseUrl({ ...routeParams, view: 'map' }), { ...querystringParams, hideDrawer: hidden }))),
    storeFetchParams: param => opts => dispatch(storeFetchParams({ ...param, ...opts })),
    storeClientFilterParams: params => dispatch(storeClientFilterParams(params)),
    viewSavedSearch: (search) => {
      const { mapPath } = generateViewParams(search)
      dispatch(viewSavedSearch(search))
      dispatch(push(mapPath))
    }
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchParams, currentUser } = stateProps
  const { fetchMembers, fetchPosts, fetchGroups, storeFetchParams, fetchSavedSearches } = dispatchProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchMembers: fetchMembers(fetchParams),
    fetchGroups: fetchGroups(fetchParams),
    fetchPosts: fetchPosts(fetchParams),
    fetchSavedSearches: currentUser ? fetchSavedSearches(currentUser.id) : () => {},
    storeFetchParams: storeFetchParams(fetchParams)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
