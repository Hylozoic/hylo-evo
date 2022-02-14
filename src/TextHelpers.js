import { marked } from 'marked'
import insane from 'insane'
import truncHTML from 'trunc-html'
import truncText from 'trunc-text'
import prettyDate from 'pretty-date'
import moment from 'moment-timezone'
import linkify from './linkify'
import { convert as convertHtmlToText } from 'html-to-text'
//
// HTML and Text presentation related

const ALLOWED_TAGS_DEFAULT = [
  'a', 'br', 'em', 'li', 'ol', 'p', 'strong', 'u', 'ul'
]
const ALLOWED_ATTRIBUTES_DEFAULT = {
  a: ['href', 'data-user-id', 'data-entity-type', 'target']
}

export function sanitizeHTML (text, allowedTags, allowedAttributes) {
  if (!text) return ''
  if (allowedTags && !Array.isArray(allowedTags)) return ''

  // remove leading &nbsp; (a side-effect of contenteditable)
  const strippedText = text.replace(/<p>&nbsp;/gi, '<p>')

  return insane(strippedText, {
    allowedTags: allowedTags || ALLOWED_TAGS_DEFAULT,
    allowedAttributes: allowedAttributes || ALLOWED_ATTRIBUTES_DEFAULT
  })
}

export function presentHTML (text, options = {}) {
  if (!text) return ''

  const {
    slug,
    noLinks,
    truncate: truncateLength,
    sanitize = false,
    allowedTags,
    allowedAttributes
  } = options
  let processedText = text

  if (sanitize) {
    processedText = sanitizeHTML(text, allowedTags, allowedAttributes)
  }

  // make links and hashtags
  if (!noLinks) {
    processedText = linkify(text, slug)
  }

  if (truncateLength) {
    processedText = truncateHTML(text, truncateLength)
  }

  return processedText
}

export const truncateHTML = (html, length) => {
  return truncHTML(html, length, {
    sanitizer: {
      allowedAttributes: {
        a: ['href', 'class', 'data-search']
      }
    }
  }).html
}

export const truncateText = (text, length) => {
  return truncText(text, length)
}

export function textLengthHTML (htmlOrText) {
  return htmlToText(htmlOrText).length
}

export const markdown = text => {
  return sanitizeHTML(
    marked.parse(text || '', { gfm: true, breaks: true })
  )
}

export function htmlToText (html) {
  return convertHtmlToText(html)
}

//
// Date string related

export function humanDate (date, short) {
  const isString = typeof date === 'string'
  const isValidDate = !isNaN(Number(date)) && Number(date) !== 0
  let ret = date && (isString || isValidDate)
    ? prettyDate.format(isString ? new Date(date) : date)
    : ''

  if (short) {
    ret = ret.replace(' ago', '')
  } else {
    // this workaround prevents a "React attempted to use reuse markup" error
    // which happens if the timestamp is less than 1 minute ago, because the
    // server renders "N seconds ago", but by the time React is loaded on the
    // client side, it's "N+1 seconds ago"
    const match = ret.match(/(\d+) seconds? ago/)
    if (match) {
      if (Number(match[1]) >= 50) return '1m ago'
      return 'just now'
    }
  }

  return ret.replace(/ minutes?/, 'm')
    .replace(/ hours?/, 'h')
    .replace(/ days?/, 'd')
    .replace(/ weeks?/, 'w')
    .replace(/ month(s?)/, ' mo$1')
}

export const formatDatePair = (startTime, endTime, returnAsObj) => {
  const start = moment.tz(startTime, moment.tz.guess())
  const end = moment.tz(endTime, moment.tz.guess())

  const now = moment()
  const isThisYear = start.year() === now.year() && end.year() === now.year()

  let to = ''
  let from = ''

  if (isThisYear) {
    from = endTime ? start.format('ddd, MMM D [at] h:mmA') : start.format('ddd, MMM D [at] h:mmA z')
  } else {
    from = endTime ? start.format('ddd, MMM D, YYYY [at] h:mmA') : start.format('ddd, MMM D, YYYY [at] h:mmA z')
  }

  if (endTime) {
    if (end.year() !== start.year()) {
      to = end.format('ddd, MMM D, YYYY [at] h:mmA z')
    } else if (end.month() !== start.month() ||
               end.day() !== start.day() ||
               end <= now) {
      to = end.format('ddd, MMM D [at] h:mmA z')
    } else {
      to = end.format('h:mmA z')
    }
    to = returnAsObj ? to : ' - ' + to
  }

  return returnAsObj ? { from, to } : from + to
}

export function isDateInTheFuture (date) {
  return moment(date).isAfter(moment())
}
