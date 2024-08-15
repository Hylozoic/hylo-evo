import React from 'react'
import { shallow } from 'enzyme'
import TopicSupportComingSoon from './index'

it('renders', () => {
  const wrapper = shallow(<TopicSupportComingSoon />)
  expect(wrapper).toMatchSnapshot()
})
