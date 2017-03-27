import { filter } from 'lodash/fp'
import prettyDate from 'pretty-date'

export function bgImageStyle (url) {
  if (!url) return {}
  const escaped = url.replace(/([\(\)])/g, (match, $1) => '\\' + $1) // eslint-disable-line
  return {backgroundImage: `url(${escaped})`}
}

export function personUrl (person) {
  // placeholder
  return '/'
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

export function humanDate (date, short) {
  const isString = typeof date === 'string'
  const isValidDate = !isNaN(Number(date)) && Number(date) !== 0
  var ret = date && (isString || isValidDate)
    ? prettyDate.format(isString ? new Date(date) : date)
    : ''
  if (short) {
    ret = ret.replace(' ago', '')
  } else {
    // this workaround prevents a "React attempted to use reuse markup" error
    // which happens if the timestamp is less than 1 minute ago, because the
    // server renders "N seconds ago", but by the time React is loaded on the
    // client side, it's "N+1 seconds ago"
    let match = ret.match(/(\d+) seconds? ago/)
    if (match) {
      if (Number(match[1]) >= 50) return '1m ago'
      return 'just now'
    }
  }
  ret = ret.replace(/ minutes?/, 'm')
  .replace(/ hours?/, 'h')
  .replace(/ days?/, 'd')
  .replace(/ weeks?/, 'w')
  .replace(/ month(s?)/, ' mo$1')
  return ret
}
