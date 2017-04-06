import linkifyString from 'linkifyjs/string'
import { tagUrl } from 'util/index'
import { isEmpty, toPairs, merge } from 'lodash'
import cheerio from 'cheerio'
import { hashtagFullRegex } from 'store/models/hashtag'

const maxLinkLength = 48

function linkifyjsOptions (slug) {
  return {
    format: (value, type) =>
      type === 'url' && value.length > maxLinkLength
        ? value.slice(0, maxLinkLength) + '…' : value,

    formatHref: function (value, type) {
      if (type === 'hashtag') {
        return tagUrl(value.substring(1), slug)
      }
      return value
    },
    linkAttributes: function (value, type) {
      if (type === 'hashtag') return {'data-search': value}
    },
    linkClass: (href, type) => type === 'hashtag' ? 'hashtag' : 'linkified'
  }
}

// unlike the linkifyjs module, this handles text that may already have html
// tags in it. it does so by generating a DOM from the text and linkifying only
// text nodes that aren't inside A tags.
export default function linkify (text, slug) {
  var $ = cheerio.load(text)

  // caveat: this isn't intended to handle arbitrarily complex html
  var run = node =>
    node.contents().map((i, el) => {
      if (el.type === 'text') return linkifyString(el.data, linkifyjsOptions(slug))
      if (el.name === 'br') return $.html(el)
      if (el.name === 'a') return cleanupLink($, el, slug)
      return recurse($, el, run)
    }).get().join('')

  return run($.root())
}

function recurse ($, el, fn) {
  const attrs = !isEmpty(el.attribs)
    ? ' ' + toPairs(el.attribs).map(([k, v]) => `${k}='${v}'`).join(' ')
    : ''

  return `<${el.name}${attrs}>${fn($(el))}</${el.name}>`
}

function cleanupLink ($, el, slug) {
  const $el = $(el)
  const text = $el.text()
  const match = text.match(hashtagFullRegex)
  if (match) {
    $el.attr('href', tagUrl(match[1], slug))
    $el.attr('data-search', match[0])
    $el.attr('class', 'hashtag')
  }

  if (text.length >= maxLinkLength) {
    $el.text(text.slice(0, maxLinkLength) + '…')
  }

  return $.html(el)
}

export function linkifyHashtags (text, slug) {
  // this takes plain text and returns html.
  // It makes links out of hashtags but ignores urls
  return linkifyString(text, merge(linkifyjsOptions(slug), {
    validate: (value, type) => type === 'hashtag'
  }))
}
