import React from 'react'
import { shallow } from 'enzyme'
import * as LayoutFlagsContext from 'contexts/LayoutFlagsContext'

import MapDrawer, { TabBar } from './MapDrawer'

const defaultMinProps = {
  context: 'groups',
  currentUser: { id: 1 },
  fetchPostsForDrawer: () => {},
  filters: { search: '', sortBy: 'updated', topics: []},
  groups: [],
  members: [],
  numFetchedPosts: 0,
  numTotalPosts: 0,
  onUpdateFilters: () => {},
  pendingPostsDrawer: false,
  posts: [],
  routeParams: { context: 'groups', slug: 'group one'},
  topics: []
}

function renderComponent (renderFunc, props = {}) {
  return renderFunc(
    <MapDrawer {...{ ...defaultMinProps, ...props }} />
  )
}

describe('MapDrawer', () => {
  beforeAll(() => {
    jest.spyOn(LayoutFlagsContext, 'useLayoutFlags').mockImplementation(() => ({}))
  })

  it('renders correctly (with min props)', () => {
    const wrapper = renderComponent(shallow)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with lots of stuff', () => {
    const props = {
      groups: [
        { id: 1, slug: 'slug2', name: 'group one', avatarUrl: 'https://google.com', description: 'yo', memberCount: 1 }
      ],
      members: [
        { id: 2, name: "hello"}
      ],
      posts: [
        { id: 1, title: 'Post', type: 'request' }
      ],
      filters: { sortBy: 'created', search: 'hello', topics: [{ id: 1, name: 'food' }]}
    }
    const wrapper = renderComponent(shallow, props)
    expect(wrapper).toMatchSnapshot()
  })

  it('searching updates map filters', () => {
    const onUpdateFilters = jest.fn()
    const wrapper = renderComponent(shallow, { onUpdateFilters, topics: [{ id: 3, name: 'DOAs'}] })
    const searchBox = wrapper.find('input').first()
    searchBox.simulate('focus')
    expect(wrapper).toMatchSnapshot()
    searchBox.simulate('keyUp', { keyCode: 13, target: { value: 'search', blur: jest.fn() }})
    expect(onUpdateFilters).toHaveBeenCalled()
  })
})

describe('TabBar', () => {
  it ('renders tabs', () => {
    const tabs = { 'Posts': 1, 'Groups': 2 }
    const selectTab = jest.fn()
    const tabBar = shallow(<TabBar currentTab='Posts' selectTab={selectTab} tabs={tabs} />)
    expect(tabBar).toMatchSnapshot()
    const groupsTab = tabBar.find('li').at(1)
    groupsTab.simulate('click')
    expect(tabBar).toMatchSnapshot()
  })
})
