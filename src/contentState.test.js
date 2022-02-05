import { convertFromRaw } from 'draft-js'
import { toHTML, fromHTML } from './contentState'
import {
  MENTION_ENTITY_TYPE,
  TOPIC_ENTITY_TYPE
} from './constants'
import rawContentState from './contentState.test.json'

const mentionHTML = `This is a test <a href="/u/99" data-user-id="99" data-entity-type="${MENTION_ENTITY_TYPE}">Hylo Tester</a>`
const mentionLegacyHTML = 'This is a test <a href="/u/99" data-user-id="99">Hylo Legacy Tester</a>'
const topicHTML = `Text before <a data-entity-type="${TOPIC_ENTITY_TYPE}">test2</a> test after`
const legacyTopicHTML = 'Text before <a>#test2</a> test after'

describe('fromHTML', () => {
  it('converts Mentions to DraftJS Entities', () => {
    const contentState = convertFromRaw(fromHTML(mentionHTML))
    const entityKey = contentState.getLastCreatedEntityKey()
    expect(contentState.getEntity(entityKey).type)
      .toEqual(MENTION_ENTITY_TYPE)
  })

  it('converts Mentions (legacy) to DraftJS Entities', () => {
    const contentState = convertFromRaw(fromHTML(mentionLegacyHTML))
    const entityKey = contentState.getLastCreatedEntityKey()
    expect(contentState.getEntity(entityKey).type)
      .toEqual(MENTION_ENTITY_TYPE)
  })

  it('converts Topics to DraftJS Entities', () => {
    const contentState = convertFromRaw(fromHTML(topicHTML))
    const entityKey = contentState.getLastCreatedEntityKey()
    expect(contentState.getEntity(entityKey).type)
      .toEqual(TOPIC_ENTITY_TYPE)
  })

  it('converts Topics (legacy) to DraftJS Entities', () => {
    const contentState = convertFromRaw(fromHTML(legacyTopicHTML))
    const entityKey = contentState.getLastCreatedEntityKey()
    expect(contentState.getEntity(entityKey).type)
      .toEqual(TOPIC_ENTITY_TYPE)
  })

  it('converts both Mentions and Topics together to DraftJS Entities', () => {
    const topicAndMentionsHTML = `test text ${topicHTML} and ${mentionHTML} ${mentionHTML}`
    const contentState = fromHTML(topicAndMentionsHTML)
    expect(contentState.entityMap[0].type).toEqual(TOPIC_ENTITY_TYPE)
    expect(contentState.entityMap[1].type).toEqual(MENTION_ENTITY_TYPE)
    expect(contentState.entityMap[2].type).toEqual(MENTION_ENTITY_TYPE)
  })
})

describe('toHTML', () => {
  it('converts an DraftJS editor ContentState into appropriate output HTML', () => {
    const contentState = rawContentState
    const expectedHTML = '<p>This is a test of a mention <a data-entity-type="mention" data-user-id="8">Loho</a> and a topic <a data-entity-type="#mention">#request</a> </p>'
    expect(toHTML(contentState)).toEqual(expectedHTML)
  })
})
