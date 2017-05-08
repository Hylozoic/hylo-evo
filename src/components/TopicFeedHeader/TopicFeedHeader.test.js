import TopicFeedHeader from './TopicFeedHeader'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<TopicFeedHeader />)
  expect(wrapper).toMatchSnapshot()
})
