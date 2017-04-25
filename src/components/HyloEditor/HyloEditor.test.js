import React from 'react'
import { shallow } from 'enzyme'
import HyloEditor from './HyloEditor'

// titlePlaceholder: PropTypes.string,
// bodyPlaceholder: PropTypes.string,
// postType: PropTypes.string,
// currentUser: PropTypes.object,
// createPost: PropTypes.func

describe('HyloEditor', () => {
  describe('#getContentHTML', () => {
    it('saves mentions', () => {
      const wrapper = shallow(<HyloEditor />)
      // expect(wrapper.find('HyloEditor')).toBeTruthy()
    })

    it('saves hashtag links', () => {
      const wrapper = shallow(<HyloEditor />)
      // expect(wrapper.find('HyloEditor')).toBeTruthy()
    })

    it('saves links', () => {
      const wrapper = shallow(<HyloEditor />)
      // expect(wrapper.find('HyloEditor')).toBeTruthy()
    })
  })
})
