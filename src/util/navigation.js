import { matchPath } from 'react-router'
import qs from 'querystring'
import { get, isEmpty, omitBy } from 'lodash'
import { host } from 'config'

// post type / post context related
//
// note: post Contexts have their own area if not default

export const POST_ID_MATCH_REGEX = '\\d+'
export const DEFAULT_POST_TYPE_CONTEXT = 'p'
export const POST_TYPE_CONTEXTS = ['project']
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

export function baseUrl ({
  memberId,
  topicName,
  networkSlug,
  communitySlug,
  defaultUrl = ''
}) {
  if (memberId) {
    return personUrl(memberId, communitySlug)
  } else if (topicName) {
    return tagUrl(topicName, communitySlug)
  } else if (networkSlug) {
    return networkUrl(networkSlug)
  } else if (communitySlug) {
    return communityUrl(communitySlug)
  } else {
    return defaultUrl
  }
}

export const origin = () =>
  typeof window !== 'undefined' ? window.location.origin : host

// derived URL paths

export function personUrl (id, slug) {
  const base = baseUrl({communitySlug: slug})

  return id ? base + `/m/${id}` : '/'
}

export function tagUrl (tagName, slug) {
  const base = baseUrl({communitySlug: slug, defaultUrl: allCommunitiesUrl()})

  return `${base}/${tagName}`
}

export function postUrl (id, slug, opts = {}) {
  let postTypeContext = get('postTypeContext', opts)
  postTypeContext = POST_TYPE_CONTEXTS.includes(postTypeContext) ? postTypeContext : DEFAULT_POST_TYPE_CONTEXT
  const base = baseUrl({
    defaultUrl: allCommunitiesUrl(),
    ...opts,
    communitySlug: slug
  })
  const result = `${base}/${postTypeContext}/${id}`

  return opts.action ? `${result}/${opts.action}` : result
}

export function commentUrl (postId, commentId, slug) {
  return `${postUrl(postId, slug)}#comment_${commentId}`
}

export function communitySettingsUrl (slug) {
  return `${communityUrl(slug)}/settings`
}

export function networkSettingsUrl (slug) {
  return `${networkUrl(slug)}/settings`
}

export function networkCommunitySettingsUrl (networkSlug, communitySlug) {
  return `${networkUrl(networkSlug)}/settings/communities/${communitySlug}`
}

export function newMessageUrl () {
  return `${messagesUrl()}/new`
}

export function topicsUrl (slug) {
  return communityUrl(slug) + '/topics'
}

export const communityJoinUrl = ({slug, accessCode}) =>
  slug && accessCode && `${origin()}/c/${slug}/join/${accessCode}`

// URL utility functions

export function makeUrl (path, params) {
  params = omitBy(params, x => !x)
  return `${path}${!isEmpty(params) ? '?' + qs.stringify(params) : ''}`
}

export function removePostFromUrl (url) {
  let matchForReplaceRegex

  // Remove default context and post id otherwise
  // remove current post id and stay in the current post
  // context.
  if (url.match(`/${DEFAULT_POST_TYPE_CONTEXT}/`)) {
    matchForReplaceRegex = `/${DEFAULT_POST_TYPE_CONTEXT}/${POST_ID_MATCH_REGEX}`
  } else {
    matchForReplaceRegex = `/${POST_ID_MATCH_REGEX}`
  }

  return url.replace(new RegExp(matchForReplaceRegex), '')
}

// n.b.: use getParam instead of this where possible.

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
