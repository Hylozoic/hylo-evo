import React from 'react'
import TopicNavigation from './TopicNavigation'
import { shallow } from 'enzyme'

const communityTopics = [
  {topic: {name: 't1'}, newPostCount: 3},
  {topic: {name: 't2'}, newPostCount: 0},
  {topic: {name: 't3'}},
  {topic: {name: 't4'}, newPostCount: 2}
]

const community = {
  slug: 'foo'
}

const requiredProps = {
  communityTopics: communityTopics,
  location: {pathname: '/'},
  backUrl: '/return-here',
  routeParams: {
    slug: community.slug
  }
}

it('renders correctly for a community', () => {
  const wrapper = shallow(<TopicNavigation {...requiredProps} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly for All Communities', () => {
  const wrapper = shallow(<TopicNavigation {...requiredProps} />)
  expect(wrapper).toMatchSnapshot()
})

it('can be clicked to expand the left nav', () => {
  const expand = jest.fn()
  const wrapper = shallow(<TopicNavigation {...requiredProps} collapsed expand={expand} />)
  wrapper.find('[data-stylename="s.header s.header-link"]').first().simulate('click')
  expect(expand).toBeCalled()
})
