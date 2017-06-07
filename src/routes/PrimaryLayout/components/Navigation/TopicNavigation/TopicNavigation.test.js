import React from 'react'
import TopicNavigation from './TopicNavigation'
import { shallow } from 'enzyme'

const communityTopics = [
  {topic: {name: 't1'}, newPostCount: 3},
  {topic: {name: 't2'}, newPostCount: 0},
  {topic: {name: 't3'}},
  {topic: {name: 't4'}, newPostCount: 2}
]

it('renders correctly for a community', () => {
  const wrapper = shallow(<TopicNavigation communityTopics={communityTopics}
    community={{slug: 'foo'}} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly for All Communities', () => {
  const wrapper = shallow(<TopicNavigation communityTopics={communityTopics} />)
  expect(wrapper).toMatchSnapshot()
})
