import React, { createElement } from 'react'
import { convertToHTML } from 'draft-convert'

export function mentionToLink (originalText, mention) {
  console.log(mention, mention.get('id'))
  return createElement(
    'a',
    {
      'data-entity-type': 'mention',
      'data-id': mention.get('id')
    },
    originalText
  )
}

export function hashtagToLink (originalText, hashtag) {
  return createElement(
    'a',
    {
      'data-entity-type': 'hashtag'
    },
    originalText
  )
}

export default convertToHTML({
  entityToHTML: (entity, originalText) => {
    switch (entity.type) {
      case 'mention':
        return mentionToLink(originalText, entity.data.mention)
      case 'hashtag':
        return hashtagToLink(originalText, entity.data.hashtag)
      default:
        return originalText
    }
  }
})
