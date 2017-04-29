import { Map } from 'immutable'
import { convertFromHTML } from 'draft-convert'

// NOTE: Legacy mention links are in this format:
// <a href="/u/99" data-user-id="99">Hylo User</a>
// "<p><a>#opensource</a>&nbsp;these&nbsp;<a>#offer</a>&nbsp;<a href="/u/21927" data-user-id="21927">Ade</a>&nbsp;</p>"
export function createMentionFromLink (contentState, node) {
  const mention = Map({
    id: node.dataset.userId,
    name: node.text,
    avatar: ''
  })
  const contentStateWithEntity = contentState.createEntity(
    'mention',
    // get from plugin config?
    'SEGMENTED',
    { mention }
  )
  return contentStateWithEntity.getLastCreatedEntityKey()
}

export function createHashtagFromLink (contentState, node) {
  const hashtag = Map({
    name: node.dataset.topic || node.text.substring(1)
  })
  const contentStateWithEntity = contentState.createEntity(
    'hashtag',
    'IMMUTABLE',
    { hashtag }
  )
  return contentStateWithEntity.getLastCreatedEntityKey()
}

export default function (contentState, html) {
  return convertFromHTML({
    htmlToEntity: (nodeName, node) => {
      if (nodeName === 'a' && node.dataset.entityType === 'mention') {
        return createMentionFromLink(contentState, node)
      // get from plugin config? node.text[0] === '#'
      } else if (nodeName === 'a' && (node.dataset.entityType === 'hashtag' || node.text[0] === '#')) {
        return createHashtagFromLink(contentState, node)
      }
    }
  })(html)
}
