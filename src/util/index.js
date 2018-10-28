import { get } from 'lodash/fp'
import { matchPath } from 'react-router'
import inflection from 'inflection'
import { host } from 'config'

export const POST_ID_MATCH_REGEX = '\\d+'
export const DEFAULT_POST_TYPE_CONTEXT = 'p'
// Post Contexts have their own area if not default
export const POST_TYPE_CONTEXTS = ['project']
export const VALID_POST_TYPE_CONTEXTS = [...POST_TYPE_CONTEXTS, DEFAULT_POST_TYPE_CONTEXT]
export const VALID_POST_TYPE_CONTEXTS_MATCH_REGEX = VALID_POST_TYPE_CONTEXTS.join('|')

export const origin = () =>
  typeof window !== 'undefined' ? window.location.origin : host

export function bgImageStyle (url) {
  if (!url) return {}
  const escaped = url.replace(/([\(\)])/g, (match, $1) => '\\' + $1) // eslint-disable-line
  return {backgroundImage: `url(${escaped})`}
}

export function personUrl (id, slug) {
  return id ? (slug ? `/c/${slug}/m/${id}` : `/m/${id}`) : '/'
}

export function tagUrl (tagName, slug) {
  if (slug) {
    return `/c/${slug}/${tagName}`
  } else {
    return `${allCommunitiesUrl()}/${tagName}`
  }
}

export function postUrl (id, slug, opts = {}) {
  let base = ''
  if (opts.memberId) {
    base = personUrl(opts.memberId, slug)
  } else if (opts.topicName) {
    base = tagUrl(opts.topicName, slug)
  } else if (opts.networkSlug) {
    base = networkUrl(opts.networkSlug)
  } else if (slug) {
    base = communityUrl(slug)
  } else {
    base = allCommunitiesUrl()
  }
  let postTypeContext = get('postTypeContext', opts)
  postTypeContext = POST_TYPE_CONTEXTS.includes(postTypeContext) ? postTypeContext : DEFAULT_POST_TYPE_CONTEXT
  let result = `${base}/${postTypeContext}/${id}`

  return opts.action ? `${result}/${opts.action}` : result
}

export function commentUrl (postId, commentId, slug) {
  return `${postUrl(postId, slug)}#comment_${commentId}`
}

export function communityUrl (slug) {
  return slug ? `/c/${slug}` : allCommunitiesUrl()
}

export function communitySettingsUrl (slug) {
  return `/c/${slug}/settings`
}

export function networkUrl (slug) {
  return slug ? `/n/${slug}` : ''
}

export function networkSettingsUrl (slug) {
  return `/n/${slug}/settings`
}

export function networkCommunitySettingsUrl (nslug, cslug) {
  return `/n/${nslug}/settings/communities/${cslug}`
}

export function threadUrl (id) {
  return `/t/${id}`
}

export function newMessageUrl () {
  return `/t/new`
}

export function messagesUrl () {
  return `/t`
}

export function allCommunitiesUrl () {
  return '/all'
}

export function topicsUrl (slug) {
  return communityUrl(slug) + '/topics'
}

export const communityJoinUrl = ({slug, accessCode}) =>
  slug && accessCode && `${origin()}/c/${slug}/join/${accessCode}`

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

export function getSlugInPath (pathname) {
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

export const dispatchEvent = (el, etype) => {
  var evObj = document.createEvent('Events')
  evObj.initEvent(etype, true, false)
  el.dispatchEvent(evObj)
}

export function isPromise (value) {
  return value && typeof value.then === 'function'
}

export const inflectedTotal = (word, count) => `${count.toLocaleString()} ${inflection.inflect(word, count)}`
