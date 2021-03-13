import { host } from 'config'
import { get, isEmpty, omitBy } from 'lodash/fp'
import qs from 'querystring'
import { matchPath } from 'react-router'

export const HYLO_ID_MATCH = '\\d+'
export const POST_ID_MATCH = HYLO_ID_MATCH
export const OPTIONAL_POST_MATCH = `:detail(post)?/:postId(${POST_ID_MATCH})?/:action(new|edit)?`
export const OPTIONAL_NEW_POST_MATCH = `:detail(post)?/:action(new)?` // TODO: need this?
export const POST_DETAIL_MATCH = `:detail(post)/:postId(${POST_ID_MATCH})/:action(edit)?`

export const REQUIRED_NEW_POST_MATCH = `:detail(post)/:action(new)`
export const REQUIRED_EDIT_POST_MATCH = `:detail(post)/:postId(${POST_ID_MATCH})/:action(edit)`

// TODO: Only place where we show a group id in the URL, do we want to do that? use slug here too?
export const GROUP_DETAIL_MATCH = `:detail(group)/:detailGroupSlug`
export const OPTIONAL_GROUP_MATCH = `:detail(group)?/(:detailGroupSlug)?`
export const REQUIRED_NEW_GROUP_MATCH = `:detail(group)/:action(new)`

// Fundamental URL paths

export function allGroupsUrl () {
  return '/all'
}

export function publicGroupsUrl () {
  return '/public'
}

export function baseUrl ({
  context,
  personId, memberId, // TODO: switch to all one of these?
  topicName,
  groupSlug,
  view,
  defaultUrl = allGroupsUrl()
}) {
  const safeMemberId = personId || memberId

  if (safeMemberId) {
    return personUrl(safeMemberId, groupSlug)
  } else if (topicName) {
    return topicUrl(topicName, { groupSlug, context })
  } else if (view) {
    return viewUrl(view, context, groupSlug, defaultUrl)
  } else if (groupSlug) {
    return groupUrl(groupSlug)
  } else if (context === 'all') {
    return allGroupsUrl()
  } else if (context === 'public') {
    return publicGroupsUrl()
  } else {
    return defaultUrl
  }
}

export function contextSwitchingUrl (newParams, routeParams) {
  const newRouteParams = {
    ...routeParams,
    // -------------------------------------------------
    // These params are cleared from the old route,
    // and at least one must be specified in newContext
    groupSlug: undefined,
    context: undefined,
    // -------------------------------------------------
    personId: undefined,
    ...newParams
  }
  return baseUrl(newRouteParams)
}

export function createGroupUrl (opts) {
  return baseUrl(opts) + '/create/group'
}

// For specific views of a group like 'map', or 'projects'
export function viewUrl (view, context, groupSlug, defaultUrl) {
  if (!view) return '/'
  const base = baseUrl({ context, groupSlug, defaultUrl })

  return `${base}/${view}`
}

// Group URLS
export function groupUrl (slug, view = '', defaultUrl = allGroupsUrl()) {
  if (slug === 'public') { // TODO: remove this?
    return publicGroupsUrl()
  } else if (slug) {
    return `/groups/${slug}` + (view ? '/' + view : '')
  } else {
    return defaultUrl
  }
}

export function groupDetailUrl (slug, opts = {}, querystringParams = {}) {
  let result = baseUrl(opts)
  result = `${result}/group/${slug}`

  return addQuerystringToPath(result, querystringParams)
}

export function groupDeleteConfirmationUrl () {
  return '/confirm-group-delete'
}

// Post URLS
export function postUrl (id, opts = {}, querystringParams = {}) {
  const action = get('action', opts)
  let result = baseUrl(opts)

  result = `${result}/post/${id}`
  if (action) result = `${result}/${action}`

  return addQuerystringToPath(result, querystringParams)
}

export function editPostUrl (id, opts = {}, querystringParams = {}) {
  return postUrl(id, { ...opts, action: 'edit' }, querystringParams)
}

export function newPostUrl (opts = {}, querystringParams = {}) {
  return postUrl('new', opts, querystringParams)
}

export function commentUrl (postId, commentId, opts = {}, querystringParams = {}) {
  return `${postUrl(postId, opts, querystringParams)}#comment_${commentId}`
}

// Messages URLs
export function messagesUrl () {
  return `/messages`
}

export function newMessageUrl () {
  return `${messagesUrl()}/new`
}

export function messageThreadUrl (id) {
  return `${messagesUrl()}/${id}`
}

export function messagePersonUrl (person) {
  // TODO: messageThreadId doesn't seem to be currently ever coming-in from the backend
  const { id: participantId, messageThreadId } = person

  return messageThreadId
    ? messageThreadUrl(messageThreadId)
    : newMessageUrl() + `?participants=${participantId}`
}

// Person URLs
export function currentUserSettingsUrl (view = '') {
  return '/settings' + (view ? '/' + view : '')
}

export function personUrl (id, groupSlug) {
  if (!id) return '/'
  const base = baseUrl({ groupSlug })

  return `${base}/members/${id}`
}

// Topics URLs
export function topicsUrl (opts, defaultUrl = allGroupsUrl()) {
  return baseUrl({ ...opts, defaultUrl }) + '/topics'
}

export function topicUrl (topicName, opts) {
  return `${topicsUrl(opts)}/${topicName}`
}

// URL utility functions

export function addQuerystringToPath (path, querystringParams) {
  querystringParams = omitBy(x => !x, querystringParams)
  return `${path}${!isEmpty(querystringParams) ? '?' + qs.stringify(querystringParams) : ''}`
}

export function removeCreateFromUrl (url) {
  const matchForReplaceRegex = `/create/.*`
  return url.replace(new RegExp(matchForReplaceRegex), '')
}

export function removePostFromUrl (url) {
  const matchForReplaceRegex = `/post/${POST_ID_MATCH}`
  return url.replace(new RegExp(matchForReplaceRegex), '')
}

export function removeGroupFromUrl (url) {
  const matchForReplaceRegex = `/group/([^/]*)`
  return url.replace(new RegExp(matchForReplaceRegex), '')
}

export function getGroupSlugInPath (pathname) {
  const match = matchPath(pathname, {
    path: '/groups/:groupSlug'
  })
  return get('params.groupSlug', match)
}

export function gotoExternalUrl (url) {
  return window.open(url, null, 'noopener,noreferrer')
}

export const origin = () =>
  typeof window !== 'undefined' ? window.location.origin : host

// Utility path functions

export function isSignupPath (path) {
  return (path.startsWith('/signup'))
}

export function isPublicPath (path) {
  return (path.startsWith('/public'))
}

export function isMapViewPath (path) {
  return (path.includes('/map'))
}
