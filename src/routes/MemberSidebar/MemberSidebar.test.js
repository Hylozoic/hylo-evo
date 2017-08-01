import MemberSide from './MemberSidebar'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<MemberSide />)
  expect(wrapper).toMatchSnapshot()
})
