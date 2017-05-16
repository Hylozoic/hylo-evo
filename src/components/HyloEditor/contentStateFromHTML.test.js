import { ContentState } from 'draft-js'
import contentStateFromHTML from './contentStateFromHTML'
import { MENTION_ENTITY_TYPE, TOPIC_ENTITY_TYPE } from './HyloEditor.constants'

const sampleText = `This is a test <a href="/u/1" data-user-id="99" data-entity-type="${MENTION_ENTITY_TYPE}">Loren Johnson</a> and the remaining text <a data-entity-type="${TOPIC_ENTITY_TYPE}">#test</a> text betweeen hastags <a data-entity-type="${TOPIC_ENTITY_TYPE}">#test2</a>`

describe('convertFromHTML', () => {
  it(`converts <a data-id="99" data-entity-type="${MENTION_ENTITY_TYPE}"> to a DraftJS Entity`, () => {
    const mentionHTML = `This is a test <a href="/u/99" data-user-id="99" data-entity-type="${MENTION_ENTITY_TYPE}">Hylo Tester</a>`
    const contentState = contentStateFromHTML(ContentState.createFromText(''), sampleText)
  })
})
