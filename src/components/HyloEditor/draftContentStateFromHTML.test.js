import { ContentState } from 'draft-js'
import draftContentStateFromHTML from './draftContentStateFromHTML'

// titlePlaceholder: PropTypes.string,
// bodyPlaceholder: PropTypes.string,
// postType: PropTypes.string,
// currentUser: PropTypes.object,
// createPost: PropTypes.func

const sampleText = `This is a test <a href="/u/1" data-id="99" data-entity-type="mention">Loren Johnson</a> and the remaining text <a data-entity-type="hashtag">#test</a> text betweeen hastags <a data-entity-type="hashtag">#test2</a>`

// const inputHTML = 'This is a test <a href="http://person-link-from-url" data-avatar="http://avatar-url-from-link" data-entity-type="mention" data-person-id="1">Loren Johnson</a> and the remaining text'

describe('convertFromHTML', () => {
  it('converts <a class="mention" /> to a DraftJS Entity', () => {
    const mentionHTML = '<a href="/u/99" data-id="99" data-entity-type="mention">Hylo Tester</a>'
    const baseContentState = ContentState.createFromText('')
    const contentState = draftContentStateFromHTML(baseContentState, sampleText)
    // console.log('contentState:', contentState)
    // const contentState = ContentState.createFromText('')
    // EditorState.createWithContent()
    // <Editor
    //   editorState={this.state.editorState}
    //   onChange={this.handleChange}
    //   placeholder={this.props.placeholder}
    //   handleReturn={this.handleReturn}
    //   plugins={plugins} />
    // const wrapper = shallow(<HyloEditor contentHTML={sampleText} />)
    // console.log(wrapper.debug())
    // expect(wrapper.find('HyloEditor')).toBeTruthy()
  })
})
