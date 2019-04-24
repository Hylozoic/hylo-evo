import React from 'react'
import TopicNavigation from './TopicNavigation'
import { shallow } from 'enzyme'

const topics = [
  {name: 't1', url: '/t1', newPostCount: 3},
  {name: 't2', url: '/t2', newPostCount: 0},
  {name: 't3', url: '/t3', current: true},
  {name: 't4', url: '/t4', newPostCount: 2}
]

const community = {
  slug: 'foo'
}

const requiredProps = {
  topics,
  location: { pathname: '/' },
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
