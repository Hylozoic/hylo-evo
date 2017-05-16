import { convertFromRaw } from 'draft-js'
import contentStateToHTML from './contentStateToHTML'
import rawContentState from './contentStateToHTML.test.json'

describe('contentStateToHTML', () => {
  it('converts an DraftJS editor ContentState into appropriate output HTML', () => {
    const contentState = convertFromRaw(rawContentState)
    const expectedHTML = '<p>This is a test of a mention <a data-entity-type="mention" data-user-id="8">Loho</a> and a topic <a data-entity-type="#mention">#request</a> </p>'
    expect(contentStateToHTML(contentState)).toEqual(expectedHTML)
  })
})
