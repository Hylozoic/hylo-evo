import AllTopics from './AllTopics'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<AllTopics />)
  expect(wrapper).toMatchSnapshot()
})
