import React from 'react'
import { shallow } from 'enzyme'
import * as LayoutFlagsContext from 'contexts/LayoutFlagsContext'

import MapDrawer from './MapDrawer'

const defaultMinProps = {
  context: 'groups',
  currentUser: { id: 1 },
  fetchPostsForDrawer: () => {},
  filters: { search: '', sortBy: 'updated', topics: []},
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
      ]
    }
    const wrapper = renderComponent(shallow, props)
    expect(wrapper).toMatchSnapshot()
  })

})
