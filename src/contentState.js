import { createElement } from 'react'
import Immutable from 'immutable'
import { convertToHTML, convertFromHTML } from 'draft-convert'
import { convertToRaw, convertFromRaw } from 'draft-js'
import { MENTION_ENTITY_TYPE, TOPIC_ENTITY_TYPE } from './constants'
import { detect } from 'detect-browser'

function serverDOMBuilder (html) {
  const jsdom = require('jsdom')
  const { JSDOM } = jsdom

  const { document: jsdomDocument, HTMLElement, HTMLAnchorElement } = (new JSDOM('<!DOCTYPE html>')).window
  // HTMLElement and HTMLAnchorElement needed on global for convertFromHTML to work
  global.HTMLElement = HTMLElement
  global.HTMLAnchorElement = HTMLAnchorElement
  // This was also needed at some point but doesn't seem to be any longer
  // global.Node = { TEXT_NODE: 3 }

  const doc = jsdomDocument.implementation.createHTMLDocument('foo')
  doc.documentElement.innerHTML = html
  const body = doc.getElementsByTagName('body')[0]
  return body
}

// NOTE: Legacy mention links are in this format --
// <a href="/u/99" data-user-id="99">Hylo User</a>
//
export function mentionFromLink (createEntity, node) {
  const mention = Immutable.Map({
    id: node.getAttribute('data-user-id'),
    name: node.text,
    avatar: ''
  })
  return createEntity(
    MENTION_ENTITY_TYPE,
    'SEGMENTED', // reference from plugin config?
    { mention }
  )
}

// NOTE: Legacy Topics are in this format --
// <a>#topic</a>
//
export function topicFromLink (createEntity, node) {
  const topic = Immutable.Map({
    name: node.text.substring(1)
  })
  return createEntity(
    TOPIC_ENTITY_TYPE,
    'IMMUTABLE', // reference from plugin config?
    { mention: topic }
  )
}

function mentionUrl (memberId, slug) {
  if (slug) {
    return `/c/${slug}/m/${memberId}`
  } else {
    return `/m/${memberId}`
  }
}

function mentionToLink (originalText, mention, slug) {
  return createElement(
    'a',
    {
      'data-entity-type': MENTION_ENTITY_TYPE,
      'data-user-id': mention.get('id'),
      href: mentionUrl(mention.get('id'), slug),
      className: 'mention'
    },
    originalText
  )
}

function tagUrl (tagName, slug) {
  if (slug) {
    return `/c/${slug}/tag/${tagName}`
  } else {
    return `/tag/${tagName}`
  }
}

function topicToLink (originalText, topic, slug) {
  return createElement(
    'a',
    {
      'data-entity-type': TOPIC_ENTITY_TYPE,
      'data-search': topic.get('name'),
      href: tagUrl(topic.get('name'), slug),
      className: 'hashtag'
    },
    originalText
  )
}

function externalLink (originalText, href) {
  return createElement(
    'a',
    {
      href,
      target: '_blank'
    },
    originalText
  )
}

export function fromHTML (html, { raw = true }) {
  const convertor = convertFromHTML(
    {
      htmlToEntity: (nodeName, node, createEntity) => {
        if (nodeName === 'a' && (node.getAttribute('data-entity-type') === MENTION_ENTITY_TYPE || node.getAttribute('data-user-id'))) {
          return mentionFromLink(createEntity, node)
        } else if (nodeName === 'a' && (node.getAttribute('data-entity-type') === TOPIC_ENTITY_TYPE || node.text[0] === '#')) {
          return topicFromLink(createEntity, node)
        }
      }
    }
  )
  // Use JSOM if in node, otherwise if in browser don't
  const { type } = detect()
  const contentState = convertor(html, {}, type === 'node' ? serverDOMBuilder : undefined)

  return raw
    ? convertToRaw(contentState)
    : contentState
}

export const toHTML = (unknownContentState, { slug }) => {
  // Automtically converts from raw format if not a contentState object
  const contentState = unknownContentState?.getEntityMap
    ? unknownContentState
    : convertFromRaw(unknownContentState)
  const result = convertToHTML({
    entityToHTML: (entity, originalText) => {
      switch (entity.type) {
        case MENTION_ENTITY_TYPE:
          return mentionToLink(originalText, Immutable.fromJS(entity.data.mention), slug)
        case TOPIC_ENTITY_TYPE:
          return topicToLink(originalText, Immutable.fromJS(entity.data.mention), slug)
        default:
          return originalText
      }
    }
  })(contentState)

  return result
}

export const toRaw = (unknownContentState) => {
  return unknownContentState?.getEntityMap
    ? convertToRaw(unknownContentState)
    : unknownContentState
}

export const fromRaw = (unknownContentState) => {
  return unknownContentState?.getEntityMap
    ? unknownContentState
    : convertFromRaw(unknownContentState)
}

// export function fromString (contentStateString) {
//   const contentStateRaw = JSON.parse(contentStateString)
//   return convertFromRaw(contentStateRaw)
// }
