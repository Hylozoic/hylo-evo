import { shallow } from 'enzyme'
import React from 'react'
import TabBar from './TabBar'

it('renders sort options', () => {
  const wrapper = shallow(<TabBar />)
  expect(wrapper).toMatchSnapshot()
})
