import React from 'react'
import { convertToHTML } from 'draft-convert'

export function mentionToLink (originalText, mention) {
  return <a data-entity-type='mention' data-person-id={mention.get('id')}>
    {originalText}
  </a>
}

export function hashtagToLink (originalText, hashtag = {name: ''}) {
  return <a data-entity-type='hashtag'>
    {originalText}
  </a>
}

export default convertToHTML({
  entityToHTML: (entity, originalText) => {
    if (entity.type === 'mention') {
      return mentionToLink(originalText, entity.data.mention)
    }
    if (entity.type === 'HASHTAG') {
      console.log(entity.data)
      return hashtagToLink(originalText)
    }
    return originalText
  }
})
