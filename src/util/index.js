import inflection from 'inflection'
import moment from 'moment'

export function bgImageStyle (url) {
  if (!url) return {}
  const escaped = url.replace(/([\(\)])/g, (match, $1) => '\\' + $1) // eslint-disable-line
  return { backgroundImage: `url(${escaped})` }
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

export const formatDatePair = (startTime, endTime) => {
  const start = moment(startTime)
  const end = moment(endTime)

  const from = start.format('ddd, MMM D [at] h:mmA')

  var to = ''

  if (endTime) {
    if (end.month() !== start.month()) {
      to = end.format(' - ddd, MMM D [at] h:mmA')
    } else if (end.date() !== start.date()) {
      to = end.format(' - ddd D [at] h:mmA')
    } else {
      to = end.format(' - h:mmA')
    }
  }

  return from + to
}

export function hexToRgb (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null
}

export function inIframe() {
  return window.location !== window.parent.location
}