import { matchPath } from 'react-router'
import qs from 'querystring'
import { get, isEmpty, omitBy } from 'lodash/fp'
import { host } from 'config'

// Post type / post context related
// * Post Contexts have their own area if not default

export const HYLO_ID_MATCH = '\\d+'
export const POST_ID_MATCH = HYLO_ID_MATCH
export const DEFAULT_POST_TYPE_CONTEXT = 'p'
export const POST_TYPE_CONTEXTS = ['project', 'event']
export const VALID_POST_TYPE_CONTEXTS = [...POST_TYPE_CONTEXTS, DEFAULT_POST_TYPE_CONTEXT]
export const VALID_POST_TYPE_CONTEXTS_MATCH = VALID_POST_TYPE_CONTEXTS.join('|')

export const POST_TYPE_CONTEXT_MATCH = `:postTypeContext(${VALID_POST_TYPE_CONTEXTS_MATCH})`
export const OPTIONAL_POST_MATCH = `${POST_TYPE_CONTEXT_MATCH}?/:postId(${POST_ID_MATCH})?/:action(new|edit)?`
export const OPTIONAL_NEW_POST_MATCH = `${POST_TYPE_CONTEXT_MATCH}?/:action(new)?`
export const POST_DETAIL_MATCH = `${POST_TYPE_CONTEXT_MATCH}/:postId(${POST_ID_MATCH})/:action(edit)?`

export const REQUIRED_NEW_POST_MATCH = `${POST_TYPE_CONTEXT_MATCH}/:action(new)`
export const REQUIRED_EDIT_POST_MATCH = `${POST_DETAIL_MATCH}/:action(edit)`

export const GROUP_CONTEXT_MATCH = `:groupContext(g)`
export const OPTIONAL_GROUP_MATCH = `${GROUP_CONTEXT_MATCH}?/:groupId(${HYLO_ID_MATCH})?/:action(new|edit)?`
export const GROUP_DETAIL_MATCH = `${GROUP_CONTEXT_MATCH}/:groupId(${HYLO_ID_MATCH})/:action(edit)?`

// Group Context
export const DEFAULT_GROUP_CONTEXT = 'g'
export const VALID_GROUP_CONTEXTS = [DEFAULT_GROUP_CONTEXT]
export const VALID_GROUP_CONTEXTS_MATCH = VALID_GROUP_CONTEXTS.join('|')

// Fundamental URL paths

export function allGroupsUrl () {
  return '/all'
}

export function publicGroupsUrl () {
  return '/public'
}

export function defaultGroupUrl () {
  return allGroupsUrl()
}

export function groupUrl (slug, defaultUrl = defaultGroupUrl()) {
  if (slug === 'public') {
    return publicGroupsUrl()
  } else if (slug) {
    return `/g/${slug}`
  } else {
    return defaultUrl
  }
}

export function threadUrl (id) {
  return `/t/${id}`
}

export function messagesUrl () {
  return `/t`
}

export const origin = () =>
  typeof window !== 'undefined' ? window.location.origin : host

export function contextSwitchingUrl (newContext, routeParams) {
  const newRouteParams = {
    ...routeParams,
    // -------------------------------------------------
    // These params are cleared from the old route,
    // and at least one must be specified in newContext
    networkSlug: undefined,
    slug: undefined,
    communitySlug: undefined,
    context: undefined,
    // -------------------------------------------------
    ...newContext
  }
  const base = baseUrl(newRouteParams)
  // TODO: This is repeated in post(s)Url helpers and dry'd up into baseUrl
  //       alternatively postTypes could potentially be deprecated to something
  //       simpler.
  const viewContext = get('postTypeContext', routeParams)

  return `${base}${viewContext ? `/${viewContext}` : ''}`
}

export function baseUrl ({
  context,
  personId, memberId,
  topicName,
  groupSlug, slug,
  view,
  defaultUrl = ''
}) {
  const safeMemberId = memberId || personId
  const safeGroupSlug = groupSlug || slug

  if (safeMemberId) {
    return personUrl(safeMemberId, safeGroupSlug)
  } else if (topicName) {
    return topicUrl(topicName, {
      groupSlug: safeGroupSlug,
      context
    })
  } else if (view) {
    return viewUrl(view, context, safeGroupSlug, defaultUrl)
  } else if (safeGroupSlug) {
    return groupUrl(safeGroupSlug)
  } else if (context === 'all') {
    return allGroupsUrl()
  } else if (context === 'public') {
    return publicGroupsUrl()
  } else {
    return defaultUrl
  }
}

export function groupDeleteConfirmationUrl () {
  return '/confirm-group-delete'
}

// derived URL paths

// For specific views of a group like 'map', or 'calendar'
export function viewUrl (view, context, groupSlug, defaultUrl) {
  if (!view) return '/'
  const base = baseUrl({ context, groupSlug, defaultUrl })

  return `${base}/${view}`
}

export function personUrl (id, groupSlug) {
  if (!id) return '/'
  const base = baseUrl({ groupSlug })

  return `${base}/m/${id}`
}

export function topicUrl (topicName, opts) {
  const base = baseUrl({ ...opts, defaultUrl: allGroupsUrl() })

  return `${base}/${topicName}`
}

export function postsUrl (opts = {}, querystringParams, defaultUrl = allGroupsUrl()) {
  const postTypeContext = get('postTypeContext', opts)
  const inPostTypeContext = POST_TYPE_CONTEXTS.includes(postTypeContext)
  const base = baseUrl({ ...opts, defaultUrl })

  const result = inPostTypeContext
    ? `${base}/${postTypeContext}`
    : `${base}`

  return addQuerystringToPath(result, querystringParams)
}

export function postUrl (id, opts = {}, querystringParams = {}) {
  const action = get('action', opts)
  const postTypeContext = get('postTypeContext', opts)
  const inPostTypeContext = POST_TYPE_CONTEXTS.includes(postTypeContext)
  let result = postsUrl(opts)

  if (!inPostTypeContext) result = `${result}/${DEFAULT_POST_TYPE_CONTEXT}`
  result = `${result}/${id}`
  if (action) result = `${result}/${action}`

  return addQuerystringToPath(result, querystringParams)
}

export function groupMapDetailUrl (id, opts = {}, querystringParams = {}) {
  const action = get('action', opts)
  let result = publicGroupsUrl()
  result = `${result}/map/${DEFAULT_GROUP_CONTEXT}/${id}`
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

export function groupSettingsUrl (groupSlug) {
  return `${groupUrl(groupSlug)}/settings`
}

export function currentUserSettingsUrl () {
  return `/settings`
}

export function newMessageUrl () {
  return `${messagesUrl()}/new`
}

export function messageThreadUrl (person) {
  // TODO: messageThreadId doesn't seem to be currently ever coming-in from the backend
  const { id: participantId, messageThreadId } = person

  return messageThreadId
    ? `/t/${messageThreadId}`
    : `/t/new?participants=${participantId}`
}

export function topicsUrl (opts, defaultUrl = allGroupsUrl()) {
  return baseUrl({ ...opts, defaultUrl }) + '/topics'
}

export const groupJoinUrl = ({ slug, accessCode }) =>
  slug && accessCode && `${origin()}/g/${slug}/join/${accessCode}`

// URL utility functions

export function addQuerystringToPath (path, querystringParams) {
  querystringParams = omitBy(x => !x, querystringParams)
  return `${path}${!isEmpty(querystringParams) ? '?' + qs.stringify(querystringParams) : ''}`
}

// * refactor to utilize react-navigation matcher and params
//   or potentially replace this in all cases with postsUrl
export function removePostFromUrl (url) {
  let matchForReplaceRegex

  // Remove default context and post id otherwise
  // remove current post id and stay in the current post
  // context.
  if (url.match(`/${DEFAULT_POST_TYPE_CONTEXT}/`)) {
    matchForReplaceRegex = `/${DEFAULT_POST_TYPE_CONTEXT}/${POST_ID_MATCH}`
  } else {
    matchForReplaceRegex = `/${POST_ID_MATCH}`
  }

  return url.replace(new RegExp(matchForReplaceRegex), '')
}

export function removeGroupFromUrl (url) {
  let matchForReplaceRegex

  // Remove default context and post id otherwise
  // remove current post id and stay in the current post
  // context.
  if (url.match(`/${DEFAULT_GROUP_CONTEXT}/`)) {
    matchForReplaceRegex = `/${DEFAULT_GROUP_CONTEXT}/${HYLO_ID_MATCH}`
  } else {
    matchForReplaceRegex = `/${HYLO_ID_MATCH}`
  }

  return url.replace(new RegExp(matchForReplaceRegex), '')
}

// n.b.: use getRouteParam instead of this where possible.

export function getGroupSlugInPath (pathname) {
  const match = matchPath(pathname, {
    path: '/g/:slug'
  })
  return get('params.slug', match)
}

export function gotoExternalUrl (url) {
  return window.open(url, null, 'noopener,noreferrer')
}

// Utility path functions

export function isSignupPath (path) {
  return (path.startsWith('/signup'))
}

export function isCreateGroupPath (path) {
  return (path.startsWith('/create-group'))
}

export function isJoinGroupPath (path) {
  return (path.startsWith('/h/use-invitation'))
}

export function isPublicPath (path) {
  return (path.startsWith('/public'))
}

export function isAllGroupsPath (path) {
  return (path.startsWith('/all'))
}

export function isTopicPath (path) {
  return (path.startsWith('/tag/'))
}

export function isMapViewPath (path) {
  return (path.includes('/map'))
}
