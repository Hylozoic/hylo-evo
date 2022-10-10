import merge from 'lodash/fp/merge'
import { marked } from 'marked'
import truncHTML from 'trunc-html'
import truncText from 'trunc-text'
import prettyDate from 'pretty-date'
import moment from 'moment-timezone'
import { convert as convertHtmlToText } from 'html-to-text'

// Sanitization options
export function insaneOptions (providedInsaneOptions) {
  return merge(
    {
      allowedTags: providedInsaneOptions?.allowedTags || [
        'a', 'br', 'em', 'p', 's', 'strong',
        'li', 'ol', 'ul',
        'div', 'iframe', 'mark', 'span',
        'blockquote', 'code', 'hr', 'pre',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
      ],
      allowedAttributes: providedInsaneOptions?.allowedAttributes || {
        a: [
          'class', 'target', 'href', 
          'data-type', 'data-id','data-label',
          'data-user-id', 'data-entity-type', 'data-search'
        ],
        span: [
          'class', 'target', 'href', 
          'data-type', 'data-id','data-label',
          'data-user-id', 'data-entity-type', 'data-search'
        ],
        code: [
          'class'
        ],
        iframe: [
          'src', 'title', 'frameborder', 'height', 'width',
          'allow', 'allowfullscreen'
        ],
        div: [
          'class'
        ]
      }
    },
    providedInsaneOptions
  )
}

export const truncateHTML = (html, truncateLength, providedInsaneOptions = {}) => {
  const options = {
    sanitizer: insaneOptions(providedInsaneOptions)
  }

  return truncHTML(html, truncateLength, options).html
}

export function presentHTMLToText (html, options = {}) {
  if (!html) return ''

  const { truncate: truncateLength, providedConvertHtmlToTextOptions = {} } = options
  const convertHtmlToTextOptions = merge(
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
    providedConvertHtmlToTextOptions
  )

  let processedText = convertHtmlToText(html, convertHtmlToTextOptions)

  if (truncateLength) {
    processedText = truncateText(processedText, truncateLength)
  }

  return processedText
}

export const truncateText = (text, length) => {
  return truncText(text, length)
}

export function textLengthHTML (htmlOrText, options) {
  return presentHTMLToText(htmlOrText, options).length
}

export const markdown = text => {
  marked.use({
    tokenizer: {
      url (src) {
        // NOTE: having nothing here disables gfm autolinks:
        // https://github.com/markedjs/marked/issues/882#issuecomment-781585009
        // New option coming in later version: https://github.com/sourcegraph/sourcegraph/pull/42203/files
      }
    }
  })
  return marked.parse(text || '', { gfm: true, breaks: true })
}

// HTML Generation Helpers

export const mentionHTML = mentioned => (
  `<span data-type="mention" class="mention" data-id="${mentioned.id}" data-label="Loren Johnson">${mentioned.name}</span>`
)

export const topicHTML = topicName => (
  `<span data-type="topic" class="topic" data-id="${topicName}" data-label="#${topicName}">${topicName}</span>`
)

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
