import React from 'react'
import { shallow } from 'enzyme'
import PostEditor from './PostEditor'

// titlePlaceholder: PropTypes.string,
// bodyPlaceholder: PropTypes.string,
// postType: PropTypes.string,
// currentUser: PropTypes.object,
// createPost: PropTypes.func

describe('PostEditor', () => {
  it('has a HyloEditor', () => {
    const wrapper = shallow(<PostEditor />)
    expect(wrapper.find('HyloEditor')).toBeTruthy()
  })
})
