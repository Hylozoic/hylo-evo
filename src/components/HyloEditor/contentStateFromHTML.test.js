import { ContentState } from 'draft-js'
import contentStateFromHTML from './contentStateFromHTML'
import {
  MENTION_ENTITY_TYPE,
  TOPIC_ENTITY_TYPE
} from './HyloEditor.constants'

const mentionHTML = `This is a test <a href="/u/99" data-user-id="99" data-entity-type="${MENTION_ENTITY_TYPE}">Hylo Tester</a>`
const topicHTML = `Text before <a data-entity-type="${TOPIC_ENTITY_TYPE}">test2</a> test after`
const legacyTopicHTML = `Text before <a>#test2</a> test after`

describe('convertFromHTML', () => {
  it(`converts Mentions to DraftJS Entities`, () => {
    const contentState = contentStateFromHTML(ContentState.createFromText(''), mentionHTML)
    const entityKey = contentState.getLastCreatedEntityKey()
    expect(contentState.getEntity(entityKey).type)
      .toEqual(MENTION_ENTITY_TYPE)
  })

  it(`converts Topics to DraftJS Entities`, () => {
    const contentState = contentStateFromHTML(ContentState.createFromText(''), topicHTML)
    const entityKey = contentState.getLastCreatedEntityKey()
    expect(contentState.getEntity(entityKey).type)
      .toEqual(TOPIC_ENTITY_TYPE)
  })

  it(`converts Topics (legacy) to DraftJS Entities`, () => {
    const contentState = contentStateFromHTML(ContentState.createFromText(''), legacyTopicHTML)
    const entityKey = contentState.getLastCreatedEntityKey()
    expect(contentState.getEntity(entityKey).type)
      .toEqual(TOPIC_ENTITY_TYPE)
  })

  it(`converts both Mentions and Topics together to DraftJS Entities`, () => {
    const topicAndMentionsHTML = `test text ${topicHTML} and ${mentionHTML} ${mentionHTML}`
    const contentState = contentStateFromHTML(ContentState.createFromText(''), topicAndMentionsHTML)
    const mentionEntityKey = contentState.getLastCreatedEntityKey()
    expect(contentState.getEntity(`${mentionEntityKey - 2}`).type)
      .toEqual(TOPIC_ENTITY_TYPE)
    expect(contentState.getEntity(`${mentionEntityKey - 1}`).type)
      .toEqual(MENTION_ENTITY_TYPE)
    expect(contentState.getEntity(`${mentionEntityKey}`).type)
      .toEqual(MENTION_ENTITY_TYPE)
  })
})
