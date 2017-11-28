import TopicSupportComingSoon from './index'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<TopicSupportComingSoon />)
  expect(wrapper).toMatchSnapshot()
})
