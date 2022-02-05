import { marked } from 'marked'
import insane from 'insane'
import truncHtml from 'trunc-html'
import linkify from './linkify'
import prettyDate from 'pretty-date'

export function sanitize (text, whitelist, attrWhitelist) {
  if (!text) return ''
  if (whitelist && !Array.isArray(whitelist)) return ''

  // remove leading &nbsp; (a side-effect of contenteditable)
  const strippedText = text.replace(/<p>&nbsp;/gi, '<p>')

  return insane(strippedText, {
    allowedTags: whitelist || ['a', 'br', 'em', 'li', 'ol', 'p', 'strong', 'ul' ],
    allowedAttributes: attrWhitelist || {
      a: ['href', 'data-user-id', 'data-entity-type', 'target']
    }
  })
}

export function present (text, opts = {}) {
  const { slug, noLinks, maxlength, noP } = opts

  if (!text) return ''
  // wrap in a <p> tag, do this by default, require opt out
  if (text.substring(0, 3) !== '<p>' && !noP) text = `<p>${text}</p>`
  // make links and hashtags
  if (!noLinks) text = linkify(text, slug)
  if (maxlength) text = truncate(text, maxlength)

  return text
}

export const truncate = (text, length) => {
  return truncHtml(text, length, {
    sanitizer: {
      allowedAttributes: {
        a: ['href', 'class', 'data-search']
      }
    }
  }).html
}

export const markdown = text => {
  return sanitize(
    marked.parse(text || '', { gfm: true, breaks: true })
  )
}

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
