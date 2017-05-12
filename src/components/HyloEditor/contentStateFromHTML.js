import { Map } from 'immutable'
import { convertFromHTML } from 'draft-convert'

// NOTE: Legacy mention links are in this format --
// <a href="/u/99" data-user-id="99">Hylo User</a>
//
export function createMentionFromLink (contentState, node) {
  const mention = Map({
    id: node.getAttribute('data-user-id'),
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

// NOTE: Legacy Topics are in this format --
// <a>#topic</a>
//
export function createTopicFromLink (contentState, node) {
  const topic = Map({
    name: node.getAttribute('topic') || node.text.substring(1)
  })
  const contentStateWithEntity = contentState.createEntity(
    'topic',
    'IMMUTABLE',
    { topic }
  )
  return contentStateWithEntity.getLastCreatedEntityKey()
}

export default function (contentState, html) {
  return convertFromHTML({
    htmlToEntity: (nodeName, node) => {
      if (nodeName === 'a' && node.getAttribute('data-entity-type') === 'mention') {
        return createMentionFromLink(contentState, node)
      // get from plugin config? node.text[0] === '#'
      } else if (nodeName === 'a' && (node.getAttribute('data-entity-type') === 'topic' || node.text[0] === '#')) {
        return createTopicFromLink(contentState, node)
      }
    }
  })(html)
}
