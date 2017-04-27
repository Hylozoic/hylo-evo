import React from 'react'
import { shallow } from 'enzyme'
import PostEditor from './PostEditor'

// titlePlaceholder: PropTypes.string,
// bodyPlaceholder: PropTypes.string,
// postType: PropTypes.string,
// currentUser: PropTypes.object,
// createPost: PropTypes.func

const sampleText = `This is a test <a href="/u/1" data-id="99" data-entity-type="mention">Loren Johnson</a> and the remaining text <a data-entity-type="hashtag">#test</a> text betweeen hastags <a data-entity-type="hashtag">#test2</a>`

// const inputHTML = 'This is a test <a href="http://person-link-from-url" data-avatar="http://avatar-url-from-link" data-entity-type="mention" data-person-id="1">Loren Johnson</a> and the remaining text'

describe('convertFromHTML', () => {
  it('converts <a class="mention" /> to a DraftJS Entity', () => {
    // <Editor
    //   editorState={this.state.editorState}
    //   onChange={this.handleChange}
    //   placeholder={this.props.placeholder}
    //   handleReturn={this.handleReturn}
    //   plugins={plugins} />
    const wrapper = shallow(<PostEditor contentHTML={sampleText} />)
    expect(wrapper.find('HyloEditor')).toBeTruthy()
  })
})
