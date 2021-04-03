import TopNav from './TopNav'
import { shallow } from 'enzyme'
import React from 'react'

it('renders as expected with no group', () => {
  const wrapper = shallow(<TopNav />)
  expect(wrapper).toMatchSnapshot()

  const logo = wrapper.find('Logo').dive()
  expect(logo.props().style).toEqual({
    backgroundImage: 'url(/hylo-merkaba.png)'
  })
})
