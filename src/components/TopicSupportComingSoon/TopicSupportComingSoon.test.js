import TopicSupportComingSoon from './index'
import { shallow } from 'enzyme'
import React from 'react'

it('renders', () => {
  const wrapper = shallow(<TopicSupportComingSoon />)
  expect(wrapper).toMatchSnapshot()
})
