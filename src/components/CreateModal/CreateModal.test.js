import PostEditorModal from './PostEditorModal'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<PostEditorModal />)
  expect(wrapper).toMatchSnapshot()
})
