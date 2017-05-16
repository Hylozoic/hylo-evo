import { createElement } from 'react'
import { convertToHTML } from 'draft-convert'
import {
  MENTION_ENTITY_TYPE,
  TOPIC_ENTITY_TYPE
} from './HyloEditor.constants'

export function mentionToLink (originalText, mention) {
  return createElement(
    'a',
    {
      'data-entity-type': MENTION_ENTITY_TYPE,
      'data-user-id': mention.id
    },
    originalText
  )
}

export function topicToLink (originalText, topic) {
  return createElement(
    'a',
    {
      'data-entity-type': TOPIC_ENTITY_TYPE
    },
    originalText
  )
}

export default convertToHTML({
  entityToHTML: (entity, originalText) => {
    switch (entity.type) {
      case MENTION_ENTITY_TYPE:
        return mentionToLink(originalText, entity.data.mention)
      case TOPIC_ENTITY_TYPE:
        return topicToLink(originalText, entity.data.mention)
      default:
        return originalText
    }
  }
})
