import TopicFeedHeader from './TopicFeedHeader'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the latest snapshot', () => {
  const wrapper = shallow(<TopicFeedHeader postsTotal={11} followersTotal={3} topicName={'petitions'} />)
  expect(wrapper).toMatchSnapshot()
})
