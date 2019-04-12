import { matchPath } from 'react-router'
import qs from 'querystring'
import { get, isEmpty, omitBy } from 'lodash/fp'
import { host } from 'config'

// post type / post context related
//
// note: post Contexts have their own area if not default

export const ID_MATCH_REGEX = '\\d+'
export const DEFAULT_POST_TYPE_CONTEXT = 'p'
export const POST_TYPE_CONTEXTS = ['project', 'event']
export const VALID_POST_TYPE_CONTEXTS = [...POST_TYPE_CONTEXTS, DEFAULT_POST_TYPE_CONTEXT]
export const VALID_POST_TYPE_CONTEXTS_MATCH_REGEX = VALID_POST_TYPE_CONTEXTS.join('|')

// fundamental URL paths

export function allCommunitiesUrl () {
  return '/all'
}

export function communityUrl (slug, defaultUrl = allCommunitiesUrl()) {
  return slug ? `/c/${slug}` : defaultUrl
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

export function baseUrl ({
  personId, memberId,
  topicName,
  networkSlug,
  communitySlug, slug,
  defaultUrl = ''
}) {
  const safeMemberId = memberId || personId
  const safeCommunitySlug = communitySlug || slug

  if (safeMemberId) {
    return personUrl(safeMemberId, safeCommunitySlug, networkSlug)
  } else if (topicName) {
    return tagUrl(topicName, safeCommunitySlug)
  } else if (networkSlug) {
    return networkUrl(networkSlug)
  } else if (safeCommunitySlug) {
    return communityUrl(safeCommunitySlug)
  } else {
    return defaultUrl
  }
}

// derived URL paths

export function personUrl (id, communitySlug, networkSlug) {
  if (!id) return '/'
  const base = baseUrl({networkSlug, communitySlug})

  return `${base}/m/${id}`
}

export function tagUrl (tagName, communitySlug) {
  const base = baseUrl({communitySlug, defaultUrl: allCommunitiesUrl()})

  return `${base}/${tagName}`
}

export function postsUrl (opts = {}, querystringParams) {
  const optsWithDefaults = {
    defaultUrl: allCommunitiesUrl(),
    ...opts
  }
  const postTypeContext = get('postTypeContext', opts)
  const inPostTypeContext = POST_TYPE_CONTEXTS.includes(postTypeContext)
  const base = baseUrl(optsWithDefaults)

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

export function editPostUrl (id, opts = {}, querystringParams = {}) {
  return postUrl(id, {...opts, action: 'edit'}, querystringParams)
}

export function newPostUrl (opts = {}, querystringParams = {}) {
  return postUrl('new', {...opts}, querystringParams)
}

export function commentUrl (postId, commentId, communitySlug) {
  return `${postUrl(postId, {communitySlug})}#comment_${commentId}`
}

export function communitySettingsUrl (communitySlug) {
  return `${communityUrl(communitySlug)}/settings`
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

export function topicsUrl (communitySlug) {
  return communityUrl(communitySlug) + '/topics'
}

export const communityJoinUrl = ({slug, accessCode}) =>
  slug && accessCode && `${origin()}/c/${slug}/join/${accessCode}`

// URL utility functions

export function addQuerystringToPath (path, querystringParams) {
  querystringParams = omitBy(x => !x, querystringParams)
  return `${path}${!isEmpty(querystringParams) ? '?' + qs.stringify(querystringParams) : ''}`
}

// TODO: refactor to utilize react-navigation matcher and params
//       or potentially replace this in all cases with postsUrl
export function removePostFromUrl (url) {
  let matchForReplaceRegex

  // Remove default context and post id otherwise
  // remove current post id and stay in the current post
  // context.
  if (url.match(`/${DEFAULT_POST_TYPE_CONTEXT}/`)) {
    matchForReplaceRegex = `/${DEFAULT_POST_TYPE_CONTEXT}/${ID_MATCH_REGEX}`
  } else {
    matchForReplaceRegex = `/${ID_MATCH_REGEX}`
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

// more utility path functions (relocated from PrimaryLayout)

export function isSignupPath (path) {
  return (path.startsWith('/signup'))
}

export function isCreateCommunityPath (path) {
  return (path.startsWith('/create-community'))
}

export function isJoinCommunityPath (path) {
  return (path.startsWith('/h/use-invitation'))
}

export function isAllCommunitiesPath (path) {
  return (path.startsWith('/all'))
}

export function isNetworkPath (path) {
  return (path.startsWith('/n/'))
}

export function isTagPath (path) {
  return (path.startsWith('/tag/'))
}
