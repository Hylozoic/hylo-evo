import React from 'react'
import Immutable from 'immutable'
import { convertToHTML, convertFromHTML } from 'draft-convert'
import { convertToRaw, convertFromRaw } from 'draft-js'
import {
  PathHelpers,
  MENTION_ENTITY_TYPE,
  TOPIC_ENTITY_TYPE,
  ALL_GROUPS_CONTEXT_SLUG
} from 'hylo-shared'

// NOTE: Legacy mention links are in this format --
// <a href="/u/99" data-user-id="99">Hylo User</a>
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

function mentionToLink (_, mention, slug) {
  return (
    <a
      href={PathHelpers.mentionPath(mention.get('id'), slug)}
      data-entity-type={MENTION_ENTITY_TYPE}
      data-user-id={mention.get('id')}
      className='mention'
    />
  )
}

function topicToLink (_, topic, slug) {
  return (
    <a
      href={PathHelpers.topicPath(topic.get('name'), slug)}
      data-entity-type={TOPIC_ENTITY_TYPE}
      data-search={topic.get('name')}
      className='hashtag'
    />
  )
}

// function externalLink (originalText, href) {
//   return createElement(
//     'a',
//     {
//       href,
//       target: '_blank'
//     },
//     originalText
//   )
// }

export function fromHTML (html, { raw = false } = {}) {
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
  const contentState = convertor(html)

  return raw
    ? convertToRaw(contentState)
    : contentState
}

export const toHTML = (unknownContentState, { slug = ALL_GROUPS_CONTEXT_SLUG } = {}) => {
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
