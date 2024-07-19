import { push } from 'connected-react-router'
import { get, isEqual, isEmpty, pick, pickBy } from 'lodash/fp'
import { connect } from 'react-redux'
import { updateUserSettings } from 'routes/UserSettings/UserSettings.store'
import changeQuerystringParam, { changeQuerystringParams } from 'store/actions/changeQuerystringParam'
import { FETCH_FOR_GROUP } from 'store/constants'
import presentPost from 'store/presenters/presentPost'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import { personUrl, postUrl, groupDetailUrl, createUrl } from 'util/navigation'
import { generateViewParams } from 'util/savedSearch'

import {
  fetchSavedSearches, deleteSearch, saveSearch, viewSavedSearch
} from '../UserSettings/UserSettings.store'

import {
  FETCH_POSTS_MAP,
  FETCH_POSTS_MAP_DRAWER,
  fetchMembers,
  fetchPostsForDrawer,
  fetchPostsForMap,
  fetchGroups,
  getCurrentTopics,
  getGroupsFilteredByTopics,
  getMembersFilteredByTopics,
  getSortedFilteredPostsForDrawer,
  getFilteredPostsForMap,
  storeClientFilterParams,
  updateState
} from './MapExplorer.store'

export function presentMember (person, groupId) {
  return {
    ...pick(['id', 'name', 'avatarUrl', 'groupRoles', 'locationObject', 'moderatedGroupMemberships', 'tagline', 'skills'], person.ref),
    type: 'member',
    skills: person.skills.toModelArray(),
    group: person.memberships.first()
      ? person.memberships.first().group.name
      : null
  }
}

export function presentGroup (group) {
  return group.ref
}

export function mapStateToProps (state, props) {
  const context = getRouteParam('context', state, props)
  let group = getGroupForCurrentRoute(state, props)
  const slug = getRouteParam('groupSlug', state, props)
  let groupSlugs = getQuerystringParam('group', state, props)
  let groupId
  if (group) {
    group = group.ref
    groupSlugs = (groupSlugs || []).concat(slug)
    groupId = group.id
  }

  const currentUser = getMe(state, props)
  const defaultChildPostInclusion = get('settings.streamChildPosts', currentUser) || 'yes'
  const childPostInclusion = getQuerystringParam('c', state, props) || defaultChildPostInclusion

  const hideDrawer = getQuerystringParam('hideDrawer', state, props) === 'true'

  // Map view parameters come from the URL query params first, and if not there then from the Redux state
  const boundingBox = get('totalBoundingBoxLoaded', state.MapExplorer)

  const fetchPostsParams = {
    childPostInclusion,
    boundingBox,
    context,
    slug,
    groupSlugs // used to filter posts by multiple groups
  }

  const topicsFromPosts = getCurrentTopics(state, fetchPostsParams)

  const stateFilters = state.MapExplorer.clientFilterParams
  const queryParams = getQuerystringParam(['search', 'sortBy', 'hide', 'topics', 'group'], state, props)
  const filters = {
    ...stateFilters,
    ...pick(['search', 'sortBy'], queryParams)
  }
  if (queryParams.hide) {
    filters.featureTypes = Object.keys(filters.featureTypes).reduce((types, type) => { types[type] = !queryParams.hide.includes(type); return types }, {})
  }
  if (queryParams.topics) {
    filters.topics = topicsFromPosts.filter(t => queryParams.topics.includes(t.id))
  }

  const fetchPostsForDrawerParams = {
    childPostInclusion,
    context,
    slug,
    groupSlugs,
    ...filters,
    types: !isEmpty(filters.featureTypes) ? Object.keys(filters.featureTypes).filter(ft => filters.featureTypes[ft]) : null,
    currentBoundingBox: filters.currentBoundingBox || boundingBox
  }

  const fetchGroupParams = {
    boundingBox,
    context,
    parentSlugs: groupSlugs // used to filter by multiple groups
  }

  const fetchMemberParams = {
    boundingBox,
    context,
    slug,
    sortBy: 'name'
  }

  // TODO: maybe filtering should happen on the presentedPosts? since we do some of that presentation in the filtering code, like calling topics.toModelArray in the filters for every post each time
  const members = getMembersFilteredByTopics(state, fetchMemberParams).map(m => presentMember(m, groupId))
  const postsForDrawer = getSortedFilteredPostsForDrawer(state, fetchPostsForDrawerParams).map(p => presentPost(p, groupId))
  const postsForMap = getFilteredPostsForMap(state, fetchPostsParams).map(p => presentPost(p, groupId))
  const groups = getGroupsFilteredByTopics(state, fetchGroupParams).map(g => presentGroup(g))

  const centerParam = getQuerystringParam('center', state, props)
  let centerLocation, defaultZoom
  if (centerParam) {
    const decodedCenter = decodeURIComponent(centerParam).split(',')
    centerLocation = { lat: decodedCenter[0], lng: decodedCenter[1] }
  } else {
    centerLocation = state.MapExplorer.centerLocation ||
      group?.locationObject?.center ||
        currentUser?.locationObject?.center ||
          null
  }
  if (centerLocation) {
    centerLocation = { lat: parseFloat(centerLocation.lat), lng: parseFloat(centerLocation.lng) }
    defaultZoom = 10
  } else {
    // Default to viewing whole map
    centerLocation = { lat: 35.442845, lng: 7.916598 }
    defaultZoom = 0
  }

  const zoomParam = getQuerystringParam('zoom', state, props)
  const zoom = zoomParam ? parseFloat(zoomParam) : state.MapExplorer.zoom || defaultZoom

  // First look for base layer style in query param, then saved local state, then user settings
  const baseStyleParam = getQuerystringParam('style', state, props)
  const baseLayerStyle = baseStyleParam || state.MapExplorer.baseLayerStyle || currentUser?.settings?.mapBaseLayer

  return {
    baseLayerStyle,
    childPostInclusion,
    centerLocation,
    context,
    currentUser,
    featureTypes: context === 'public' ? ['discussion', 'request', 'offer', 'resource', 'project', 'proposal', 'event', 'group'] : ['discussion', 'request', 'offer', 'resource', 'project', 'proposal', 'event', 'member', 'group'],
    fetchGroupParams,
    fetchMemberParams,
    fetchPostsParams,
    fetchPostsForDrawerParams,
    filters,
    group,
    groups,
    groupPending: state.pending[FETCH_FOR_GROUP],
    hideDrawer,
    members,
    pendingPostsMap: state.pending[FETCH_POSTS_MAP],
    pendingPostsDrawer: state.pending[FETCH_POSTS_MAP_DRAWER],
    postsForDrawer,
    postsForMap,
    queryParams,
    routeParams: get('match.params', props),
    searches: state.MapExplorer.searches,
    selectedSearch: state.SavedSearches.selectedSearch,
    stateFilters, // pass this down so we can keep it synced with filters from URL
    topics: topicsFromPosts,
    totalBoundingBoxLoaded: boundingBox,
    zoom
  }
}

export function mapDispatchToProps (dispatch, props) {
  const routeParams = get('match.params', props)

  const updateUrlFromStore = (params, replace) => {
    const querystringParams = getQuerystringParam(['sortBy', 'search', 'hide', 'topics'], null, props)

    // See if we need to update the URL to match the new filters in the redux store
    let newQueryParams = { ...pick([ 'search', 'sortBy' ], params) }
    if (params.featureTypes) {
      newQueryParams['hide'] = Object.keys(params.featureTypes).filter(type => !params.featureTypes[type])
    }
    if (params.topics) {
      newQueryParams['topics'] = params.topics.map(t => t.id)
    }
    newQueryParams = pickBy((val, key) => {
      return !isEqual(val, querystringParams[key])
    }, newQueryParams)

    if (!isEmpty(newQueryParams)) {
      dispatch(changeQuerystringParams(props, newQueryParams, replace))
    }
  }

  return {
    changeChildPostInclusion: childPostsBool => {
      dispatch(updateUserSettings({ settings: { streamChildPosts: childPostsBool } }))
      return dispatch(changeQuerystringParam(props, 'c', childPostsBool, 'yes'))
    },
    fetchMembers: (params) => () => dispatch(fetchMembers({ ...params })),
    fetchPostsForDrawer: (params) => (offset = 0, replace = true) => dispatch(fetchPostsForDrawer({ ...params, offset, replace })),
    fetchPostsForMap: (params) => () => dispatch(fetchPostsForMap({ ...params })),
    fetchGroups: (params) => () => dispatch(fetchGroups({ ...params })),
    fetchSavedSearches: (userId) => () => dispatch(fetchSavedSearches(userId)),
    deleteSearch: (searchId) => dispatch(deleteSearch(searchId)),
    saveSearch: (params) => dispatch(saveSearch(params)),
    showDetails: (postId) => dispatch(push(postUrl(postId, { ...routeParams, view: 'map' }, getQuerystringParam(['hideDrawer', 't', 'group'], null, props)))),
    showGroupDetails: (groupSlug) => dispatch(push(groupDetailUrl(groupSlug, { ...routeParams, view: 'map' }, getQuerystringParam(['hideDrawer', 't', 'group'], null, props)))),
    showCreateModal: (location) => dispatch(push(createUrl(routeParams, location))),
    gotoMember: (memberId) => dispatch(push(personUrl(memberId, routeParams.groupSlug))),
    toggleDrawer: (hidden) => dispatch(changeQuerystringParam(props, 'hideDrawer', hidden)),
    storeClientFilterParams: params => {
      return dispatch(storeClientFilterParams(params)).then(() => {
        updateUrlFromStore(params, true)
      })
    },
    updateBaseLayerStyle: (style) => props.currentUser && dispatch(updateUserSettings({ settings: { mapBaseLayer: style } })).then(() => dispatch(changeQuerystringParams(props, { style }, true))),
    updateBoundingBox: bbox => dispatch(updateState({ totalBoundingBoxLoaded: bbox })),
    updateQueryParams: (params, replace) => updateUrlFromStore(params, replace),
    updateView: ({ centerLocation, zoom }) => {
      const newUrlParams = {
        zoom
      }
      newUrlParams['center'] = encodeURIComponent(centerLocation.lat + ',' + centerLocation.lng)
      dispatch(updateState({ centerLocation, zoom })).then(() => dispatch(changeQuerystringParams(props, newUrlParams, true)))
    },
    viewSavedSearch: (search) => {
      const { mapPath } = generateViewParams(search)
      dispatch(viewSavedSearch(search))
      dispatch(push(mapPath))
    }
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser, fetchGroupParams, fetchPostsParams, fetchMemberParams, fetchPostsForDrawerParams } = stateProps
  const { fetchMembers, fetchPostsForDrawer, fetchPostsForMap, fetchGroups, fetchSavedSearches } = dispatchProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchMembers: fetchMembers(fetchMemberParams),
    fetchGroups: fetchGroups(fetchGroupParams),
    fetchPostsForDrawer: fetchPostsForDrawer(fetchPostsForDrawerParams),
    fetchPostsForMap: fetchPostsForMap(fetchPostsParams),
    fetchSavedSearches: currentUser ? fetchSavedSearches(currentUser.id) : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
