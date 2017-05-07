import HyloModal from './HyloModal'
import { shallow } from 'enzyme'
import React from 'react'

it('renders with minimum props', () => {
  const content = 'test'
  const wrapper = shallow(<HyloModal>{content}</HyloModal>)
  expect(wrapper.children().nodes[0]).toEqual(content)
  expect(wrapper).toMatchSnapshot()
})
