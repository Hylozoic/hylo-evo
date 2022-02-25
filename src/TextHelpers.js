import merge from 'lodash/fp/merge'
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

export function sanitizeHTML (text, providedOptions) {
  if (!text) return ''

  const options = merge(
    {
      allowedTags: providedOptions?.allowedTags || [
        'a', 'br', 'em', 'li', 'ol', 'p', 'strong', 'u', 'ul'
      ],
      allowedAttributes: providedOptions?.allowedAttributes || {
        a: ['href', 'data-user-id', 'data-entity-type', 'target']
      }
    },
    providedOptions
  )

  // remove leading &nbsp; (a side-effect of contenteditable)
  const strippedText = text.replace(/<p>&nbsp;/gi, '<p>')

  return insane(strippedText, options)
}

export function presentHTML (text, options = {}) {
  if (!text) return ''

  const {
    slug,
    noLinks,
    truncate: truncateLength,
    sanitize = false,
    sanitizeOptions = {}
  } = options
  let processedText = text

  // Note: Unless used on the backend text should be assumed to
  // already be sanitized when using this function
  if (sanitize) {
    processedText = sanitizeHTML(text, sanitizeOptions)
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

export const truncateHTML = (html, length, providedOptions = {}) => {
  const options = merge(
    {
      sanitizer: {
        allowedAttributes: {
          a: providedOptions?.sanitizer?.allowedAttributes || [
            'href', 'class', 'data-search'
          ]
        }
      }
    },
    providedOptions
  )

  return truncHTML(html, length, options).html
}

export const truncateText = (text, length) => {
  return truncText(text, length)
}

export function textLengthHTML (htmlOrText, options) {
  return htmlToText(htmlOrText, options).length
}

export const markdown = text => {
  return marked.parse(text || '', { gfm: true, breaks: true })
}

export function htmlToText (html, providedOptions = {}) {
  const options = merge(
    {
      selectors: [
        {
          selector: 'a',
          options: {
            ignoreHref: true
          }
        }
      ]
    },
    providedOptions
  )

  return convertHtmlToText(html, options)
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
