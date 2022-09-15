import merge from 'lodash/fp/merge'
import forEach from 'lodash/fp/forEach'
import { marked } from 'marked'
import insane from 'insane'
import truncHTML from 'trunc-html'
import truncText from 'trunc-text'
import prettyDate from 'pretty-date'
import moment from 'moment-timezone'
import linkifyHTML from 'linkify-html'
import { convert as convertHtmlToText } from 'html-to-text'
import { personUrl, topicUrl } from './NavigationHelpers'

// HTML and Text presentation related

export const MAX_LINK_LENGTH = 48
export const HYLO_URL_REGEX = /http[s]?:\/\/(?:www\.)?hylo\.com(.*)/gi // https://regex101.com/r/0GZMny/1
// NOTE: May still wish to use this if some legacy content proves to not have linked topics
export const HASHTAG_FULL_REGEX = /^#([A-Za-z][\w_-]+)$/

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

// This should only ever be used from hylo-node / backend output APIs
export function sanitizeHTML (text, providedInsaneOptions) {
  if (!text) return ''

  const options = insaneOptions(providedInsaneOptions)

  // remove leading &nbsp; (a side-effect of contenteditable)
  const strippedText = text.replace(/<p>&nbsp;/gi, '<p>')

  return insane(strippedText, options)
}

// exported for testing, always use presentHTML, not this
export const truncateHTML = (html, truncateLength, providedInsaneOptions = {}) => {
  const options = {
    sanitizer: insaneOptions(providedInsaneOptions)
  }

  return truncHTML(html, truncateLength, options).html
}

export function processHTML (contentHTML, groupSlug) {
  const linkifiedContentHTML = linkifyHTML(contentHTML)
  let dom

  // Node
  if (typeof window === 'undefined') {
    const { JSDOM } = require('jsdom')
    const jsdom = new JSDOM(linkifiedContentHTML)
    dom = jsdom.window.document
  // Browser
  } else {
    const parser = new window.DOMParser()
    dom = parser.parseFromString(linkifiedContentHTML, 'text/html')
  }
  
  // Make Hylo `anchors` relative links with `target='_self'`, otherwise `target=_blank`
  forEach(el => {
    if (el.getAttribute('href')) {
      if (el.textContent.length > MAX_LINK_LENGTH) {
        el.innerHTML = `${el.textContent.slice(0, MAX_LINK_LENGTH)}…`
      }

      const hyloLinksMatch = el.getAttribute('href').matchAll(HYLO_URL_REGEX).next()

      if (hyloLinksMatch?.value && hyloLinksMatch?.value?.length === 2) {
        const relativeURLPath = hyloLinksMatch.value[1] === '' ? '/' : hyloLinksMatch.value[1]

        el.setAttribute('target', '_self')
        el.setAttribute('href', relativeURLPath)
      } else {
        el.setAttribute('target', '_blank')
      }
    }
  }, dom.querySelectorAll('a'))

  // Convert Mention and Topic `spans` to `anchors`
  const convertSpansToAnchors = forEach(el => {
    const anchorElement = dom.createElement('a')
    const href = el.className === 'mention'
      ? personUrl(el.getAttribute('data-id'), groupSlug)
      : topicUrl(el.getAttribute('data-label'), { groupSlug })

    for (const attr of el.attributes) {
      anchorElement.setAttribute(attr.name, attr.value)
    }

    anchorElement.innerHTML = el.innerHTML
    anchorElement.setAttribute('href', href)
    anchorElement.setAttribute('target', '_self')

    el.parentNode.replaceChild(anchorElement, el)
  })
  convertSpansToAnchors(dom.querySelectorAll(
    'span.topic, span.mention'
  ))

  // Normalize legacy Mention and Topic `anchors`
  const convertLegacyAnchors = forEach(el => {
    let href

    if (el.getAttribute('data-entity-type') === 'mention') {
      el.className = 'mention'
      href = personUrl(el.getAttribute('data-user-id'), groupSlug)
    } else {
      el.className = 'topic'
      href = topicUrl(el.getAttribute('data-search') || el.textContent?.slice(1), { groupSlug })
    }

    el.setAttribute('href', href)
    el.setAttribute('target', '_self')
  })
  convertLegacyAnchors(dom.querySelectorAll(
    'a[data-entity-type="#mention"], a[data-entity-type="mention"], a[data-user-id], a.hashtag'
  ))

  return dom.querySelector('body').innerHTML
}

export function presentHTML (html, options = {}, providedInsaneOptions = {}) {
  if (!html) return ''

  const { slug, truncate: truncateLength } = options

  let processedHTML = processHTML(html, slug)

  if (truncateLength) {
    processedHTML = truncateHTML(processedHTML, truncateLength, providedInsaneOptions)
  }

  return processedHTML
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
  // https://github.com/markedjs/marked/issues/882#issuecomment-781585009
  marked.use({
    tokenizer: {
      url (src) {
        // having nothing here disables gfm autolinks
      }
    }
  })
  return marked.parse(text || '', { gfm: true, breaks: true })
}

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
