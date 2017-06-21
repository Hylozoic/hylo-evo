import React from 'react'
import TopicNavigation from './TopicNavigation'
import { shallow } from 'enzyme'

const communityTopics = [
  {topic: {name: 't1'}, newPostCount: 3},
  {topic: {name: 't2'}, newPostCount: 0},
  {topic: {name: 't3'}},
  {topic: {name: 't4'}, newPostCount: 2}
]

const requiredProps = {
  communityTopics: communityTopics,
  location: {pathname: '/'}
}

it('renders correctly for a community', () => {
  const wrapper = shallow(<TopicNavigation {...requiredProps} community={{slug: 'foo'}} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly for All Communities', () => {
  const wrapper = shallow(<TopicNavigation {...requiredProps} />)
  expect(wrapper).toMatchSnapshot()
})

it('can be clicked to expand the left nav', () => {
  const expand = jest.fn()
  const wrapper = shallow(<TopicNavigation {...requiredProps} collapsed expand={expand} />)
  wrapper.find('> div').first().simulate('click')
  expect(expand).toBeCalled()
})
