import AllCommunitiesFeed from './AllCommunitiesFeed'
import { shallow } from 'enzyme'
import React from 'react'

it('renders as expected', () => {
  const wrapper = shallow(<AllCommunitiesFeed filter='request' />)
  expect(wrapper).toMatchSnapshot()
})

it('displays the regular FeedBanner if on the main feed', () => {
  const props = {}
  const wrapper = shallow(<AllCommunitiesFeed {...props} />)
  expect(wrapper.find('FeedBanner')).toHaveLength(1)
  expect(wrapper.find('TopicFeedHeader')).toHaveLength(0)
})

it('displays the TopicFeedHeader if on a topic feed', () => {
  const props = {
    topicName: 'petitions'
  }
  const wrapper = shallow(<AllCommunitiesFeed {...props} />)
  expect(wrapper.find('FeedBanner')).toHaveLength(0)
  expect(wrapper.find('Connect(TopicFeedHeader)')).toHaveLength(1)
})
