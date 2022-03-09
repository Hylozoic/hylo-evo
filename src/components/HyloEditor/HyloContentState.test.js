import {
  toHTML,
  fromHTML
} from './HyloContentState'
import { MENTION_ENTITY_TYPE, TOPIC_ENTITY_TYPE } from 'hylo-shared'

import rawContentState from './HyloContentState.test.json'

const mentionHTML = `This is a test <a href="/u/99" data-user-id="99" data-entity-type="${MENTION_ENTITY_TYPE}">Hylo Tester</a>`
const mentionLegacyHTML = 'This is a test <a href="/u/99" data-user-id="99">Hylo Legacy Tester</a>'
const topicHTML = `Text before <a data-entity-type="${TOPIC_ENTITY_TYPE}">test2</a> test after`
const legacyTopicHTML = 'Text before <a>#test2</a> test after'

describe('fromHTML', () => {
  it('converts Mentions to DraftJS Entities', () => {
    const contentState = fromHTML(mentionHTML)
    const entityKey = contentState.getLastCreatedEntityKey()
    expect(contentState.getEntity(entityKey).type)
      .toEqual(MENTION_ENTITY_TYPE)
  })

  it('converts Mentions (legacy) to DraftJS Entities', () => {
    const contentState = fromHTML(mentionLegacyHTML)
    const entityKey = contentState.getLastCreatedEntityKey()
    expect(contentState.getEntity(entityKey).type)
      .toEqual(MENTION_ENTITY_TYPE)
  })

  it('converts Topics to DraftJS Entities', () => {
    const contentState = fromHTML(topicHTML)
    const entityKey = contentState.getLastCreatedEntityKey()
    expect(contentState.getEntity(entityKey).type)
      .toEqual(TOPIC_ENTITY_TYPE)
  })

  it('converts Topics (legacy) to DraftJS Entities', () => {
    const contentState = fromHTML(legacyTopicHTML)
    const entityKey = contentState.getLastCreatedEntityKey()
    expect(contentState.getEntity(entityKey).type)
      .toEqual(TOPIC_ENTITY_TYPE)
  })

  it('converts both Mentions and Topics together to DraftJS Entities', () => {
    const topicAndMentionsHTML = `test text ${topicHTML} and ${mentionHTML} ${mentionHTML}`
    const contentState = fromHTML(topicAndMentionsHTML, { raw: true })
    expect(contentState.entityMap[0].type).toEqual(TOPIC_ENTITY_TYPE)
    expect(contentState.entityMap[1].type).toEqual(MENTION_ENTITY_TYPE)
    expect(contentState.entityMap[2].type).toEqual(MENTION_ENTITY_TYPE)
  })
})

describe('toHTML', () => {
  it('converts an DraftJS editor Raw ContentState into appropriate output HTML', () => {
    const contentState = rawContentState
    const expectedHTML = '<p>This is a test of a mention <a href="/all/members/8" data-entity-type="mention" data-user-id="8" class="mention">Loho</a> and a topic <a href="/all/topics/request" data-entity-type="#mention" data-search="request" class="hashtag">#request</a> </p>'
    expect(toHTML(contentState)).toEqual(expectedHTML)
  })
})
