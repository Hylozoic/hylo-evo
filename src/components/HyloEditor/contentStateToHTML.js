import { createElement } from 'react'
import { convertToHTML } from 'draft-convert'

export function mentionToLink (originalText, mention) {
  return createElement(
    'a',
    {
      'data-entity-type': 'mention',
      'data-user-id': mention.get('id')
    },
    originalText
  )
}

export function topicToLink (originalText, topic) {
  return createElement(
    'a',
    {
      'data-entity-type': 'topic'
    },
    originalText
  )
}

export default convertToHTML({
  entityToHTML: (entity, originalText) => {
    switch (entity.type) {
      case 'mention':
        return mentionToLink(originalText, entity.data.mention)
      case 'topic':
        return topicToLink(originalText, entity.data.topic)
      default:
        return originalText
    }
  }
})
