import { ContentState } from 'draft-js'
import contentStateFromHTML from './contentStateFromHTML'

const sampleText = `This is a test <a href="/u/1" data-user-id="99" data-entity-type="mention">Loren Johnson</a> and the remaining text <a data-entity-type="topic">#test</a> text betweeen hastags <a data-entity-type="topic">#test2</a>`

describe('convertFromHTML', () => {
  it('converts <a data-id="99" data-entity-type="mention"> to a DraftJS Entity', () => {
    const mentionHTML = `This is a test <a href="/u/99" data-user-id="99" data-entity-type="mention">Hylo Tester</a>`
    const contentState = contentStateFromHTML(ContentState.createFromText(''), sampleText)
  })
})
