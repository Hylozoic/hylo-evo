import { Map } from 'immutable'
import { convertFromHTML } from 'draft-convert'
import { MENTION_ENTITY_TYPE, TOPIC_ENTITY_TYPE } from './HyloEditor.constants'

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
    MENTION_ENTITY_TYPE,
    'SEGMENTED', // reference from plugin config?
    { mention }
  )
  return contentStateWithEntity.getLastCreatedEntityKey()
}

// NOTE: Legacy Topics are in this format --
// <a>#topic</a>
//
export function createTopicFromLink (contentState, node) {
  const topic = Map({
    name: node.text.substring(1)
  })
  const contentStateWithEntity = contentState.createEntity(
    TOPIC_ENTITY_TYPE,
    'IMMUTABLE', // reference from plugin config?
    { mention: topic }
  )
  return contentStateWithEntity.getLastCreatedEntityKey()
}

export default function (contentState, html) {
  return convertFromHTML({
    htmlToEntity: (nodeName, node) => {
      if (nodeName === 'a' && node.getAttribute('data-entity-type') === MENTION_ENTITY_TYPE) {
        return createMentionFromLink(contentState, node)
      } else if (nodeName === 'a' && (node.getAttribute('data-entity-type') === TOPIC_ENTITY_TYPE || node.text[0] === '#')) {
        return createTopicFromLink(contentState, node)
      }
    }
  })(html)
}
