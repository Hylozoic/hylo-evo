import React from 'react'
import { shallow } from 'enzyme'
import { LayoutFlagsProvider } from 'contexts/LayoutFlagsContext'
import MapDrawer from './MapDrawer'

const defaultMinProps = {
  context: 'groups',
  currentUser: { id: 1 },
  fetchPostsForDrawer: () => {},
  filters: { search: '', sortBy: 'name', topics: []},
  groups: [],
  members: [],
  numFetchedPosts: 0,
  numTotalPosts: 0,
  onUpdateFilter: () => {},
  pendingPostsDrawer: false,
  posts: [],
  routeParams: { context: 'groups', slug: 'group one'},
  topics: []
}

function renderComponent (renderFunc, props = {}) {
  return renderFunc(
      <LayoutFlagsProvider><MapDrawer {...{ ...defaultMinProps, ...props }} /></LayoutFlagsProvider>
  )
}

describe('MapDrawer', () => {
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
      ]
    }
    const wrapper = renderComponent(shallow, props)
    expect(wrapper).toMatchSnapshot()
  })

})
