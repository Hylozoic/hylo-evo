import { filter } from 'lodash/fp'

export function bgImageStyle (url) {
  if (!url) return {}
  const escaped = url.replace(/([\(\)])/g, (match, $1) => '\\' + $1) // eslint-disable-line
  return {backgroundImage: `url(${escaped})`}
}

export function personUrl (id, slug) {
  return slug ? `/c/${slug}/m/${id}` : `/m/${id}`
}

export function tagUrl (tagName, slug) {
  if (slug) {
    return `/c/${slug}/tag/${tagName}`
  } else {
    return `/tag/${tagName}`
  }
}

export function postUrl (id, slug) {
  if (slug) {
    return `/c/${slug}/p/${id}`
  } else {
    return `/all/p/${id}`
  }
}

export function communityUrl (slug) {
  return `/c/${slug}`
}

export function getSlugInPath (pathname) {
  const match = pathname.match(/\/c\/([^/]+)/)
  return match ? match[1] : null
}

export const findChildLink = element => {
  if (element.nodeName === 'A') return element
  if (element.hasChildNodes()) {
    const mappedNodes = []
    for (var i = 0; i < element.childNodes.length; i++) {
      mappedNodes.push(findChildLink(element.childNodes[i]))
    }
    return filter(id => id, mappedNodes)[0]
  }
  return false
}

export const dispatchEvent = (el, etype) => {
  var evObj = document.createEvent('Events')
  evObj.initEvent(etype, true, false)
  el.dispatchEvent(evObj)
}

export function isPromise (value) {
  return value && typeof value.then === 'function'
}
