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
  } else if (slug) {
    base = communityUrl(slug)
  } else {
    base = allCommunitiesUrl()
  }
  return `${base}/p/${id}`
}

export function commentUrl (postId, commentId, slug) {
  return `${postUrl(postId, slug)}#comment_${commentId}`
}

export function communityUrl (slug) {
  return `/c/${slug}`
}

export function communitySettingsUrl (slug) {
  return `/c/${slug}/settings`
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

// n.b.: use getParam instead of this where possible.

export function getSlugInPath (pathname) {
  const match = pathname.match(/\/c\/([^/]+)/)
  return match ? match[1] : null
}

export const dispatchEvent = (el, etype) => {
  var evObj = document.createEvent('Events')
  evObj.initEvent(etype, true, false)
  el.dispatchEvent(evObj)
}

export function isPromise (value) {
  return value && typeof value.then === 'function'
}
