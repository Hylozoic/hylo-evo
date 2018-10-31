import MemberSide from './MemberSidebar'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const props = {
    match: {
      params: {}
    }
  }
  const wrapper = shallow(<MemberSide {...props} />)
  expect(wrapper).toMatchSnapshot()
})
