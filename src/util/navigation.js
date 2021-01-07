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

export const COMMUNITY_CONTEXT_MATCH = `:communityContext(c)`
export const OPTIONAL_COMMUNITY_MATCH = `${COMMUNITY_CONTEXT_MATCH}?/:communityId(${HYLO_ID_MATCH})?/:action(new|edit)?`
export const COMMUNITY_DETAIL_MATCH = `${COMMUNITY_CONTEXT_MATCH}/:communityId(${HYLO_ID_MATCH})/:action(edit)?`

// Community Context
export const DEFAULT_COMMUNITY_CONTEXT = 'c'
export const VALID_COMMUNITY_CONTEXTS = [DEFAULT_COMMUNITY_CONTEXT]
export const VALID_COMMUNITY_CONTEXTS_MATCH = VALID_COMMUNITY_CONTEXTS.join('|')

// Fundamental URL paths

export function allCommunitiesUrl () {
  return '/all'
}

export function publicCommunitiesUrl () {
  return '/public'
}

export function defaultCommunityUrl () {
  return allCommunitiesUrl()
}

export function communityUrl (slug, defaultUrl = defaultCommunityUrl()) {
  if (slug === 'public') {
    return publicCommunitiesUrl()
  } else if (slug) {
    return `/c/${slug}`
  } else {
    return defaultUrl
  }
}

export function networkUrl (slug) {
  return slug ? `/n/${slug}` : ''
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
  networkSlug,
  communitySlug, slug,
  view,
  defaultUrl = ''
}) {
  const safeMemberId = memberId || personId
  const safeCommunitySlug = communitySlug || slug

  if (safeMemberId) {
    return personUrl(safeMemberId, safeCommunitySlug, networkSlug)
  } else if (topicName) {
    return topicUrl(topicName, {
      communitySlug: safeCommunitySlug,
      networkSlug,
      context
    })
  } else if (view) {
    return viewUrl(view, context, safeCommunitySlug, networkSlug, defaultUrl)
  } else if (networkSlug) {
    return networkUrl(networkSlug)
  } else if (safeCommunitySlug) {
    return communityUrl(safeCommunitySlug)
  } else if (context === 'all') {
    return allCommunitiesUrl()
  } else if (context === 'public') {
    return publicCommunitiesUrl()
  } else {
    return defaultUrl
  }
}

export function communityDeleteConfirmationUrl () {
  return '/confirm-community-delete'
}

// derived URL paths

// For specific views of a community or network like 'map', or 'calendar'
export function viewUrl (view, context, communitySlug, networkSlug, defaultUrl) {
  if (!view) return '/'
  const base = baseUrl({ context, networkSlug, communitySlug, defaultUrl })

  return `${base}/${view}`
}

export function personUrl (id, communitySlug, networkSlug) {
  if (!id) return '/'
  const base = baseUrl({ networkSlug, communitySlug })

  return `${base}/m/${id}`
}

export function topicUrl (topicName, opts) {
  const base = baseUrl({ ...opts, defaultUrl: allCommunitiesUrl() })

  return `${base}/${topicName}`
}

export function postsUrl (opts = {}, querystringParams, defaultUrl = allCommunitiesUrl()) {
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

export function communityMapDetailUrl (id, opts = {}, querystringParams = {}) {
  const action = get('action', opts)
  let result = publicCommunitiesUrl()
  result = `${result}/map/${DEFAULT_COMMUNITY_CONTEXT}/${id}`
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

export function communitySettingsUrl (communitySlug) {
  return `${communityUrl(communitySlug)}/settings`
}

export function currentUserSettingsUrl () {
  return `/settings`
}

export function networkSettingsUrl (networkSlug) {
  return `${networkUrl(networkSlug)}/settings`
}

export function networkCommunitySettingsUrl (networkSlug, communitySlug) {
  return `${networkUrl(networkSlug)}/settings/communities/${communitySlug}`
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

export function topicsUrl (opts, defaultUrl = allCommunitiesUrl()) {
  return baseUrl({ ...opts, defaultUrl }) + '/topics'
}

export const communityJoinUrl = ({ slug, accessCode }) =>
  slug && accessCode && `${origin()}/c/${slug}/join/${accessCode}`

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

export function removeCommunityFromUrl (url) {
  let matchForReplaceRegex

  // Remove default context and post id otherwise
  // remove current post id and stay in the current post
  // context.
  if (url.match(`/${DEFAULT_COMMUNITY_CONTEXT}/`)) {
    matchForReplaceRegex = `/${DEFAULT_COMMUNITY_CONTEXT}/${HYLO_ID_MATCH}`
  } else {
    matchForReplaceRegex = `/${HYLO_ID_MATCH}`
  }

  return url.replace(new RegExp(matchForReplaceRegex), '')
}

// n.b.: use getRouteParam instead of this where possible.

export function getCommunitySlugInPath (pathname) {
  const match = matchPath(pathname, {
    path: '/c/:slug'
  })
  return get('params.slug', match)
}

export function getNetworkSlugInPath (pathname) {
  const match = matchPath(pathname, {
    path: '/n/:networkSlug'
  })
  return get('params.networkSlug', match)
}

export function gotoExternalUrl (url) {
  return window.open(url, null, 'noopener,noreferrer')
}

// Utility path functions

export function isSignupPath (path) {
  return (path.startsWith('/signup'))
}

export function isCreateCommunityPath (path) {
  return (path.startsWith('/create-community'))
}

export function isJoinCommunityPath (path) {
  return (path.startsWith('/h/use-invitation'))
}

export function isPublicPath (path) {
  return (path.startsWith('/public'))
}

export function isAllCommunitiesPath (path) {
  return (path.startsWith('/all'))
}

export function isNetworkPath (path) {
  return (path.startsWith('/n/'))
}

export function isTopicPath (path) {
  return (path.startsWith('/tag/'))
}

export function isMapViewPath (path) {
  return (path.includes('/map'))
}
