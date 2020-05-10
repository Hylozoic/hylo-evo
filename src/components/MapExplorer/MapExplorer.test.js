import React from 'react'
import { shallow } from 'enzyme'
import MapExplorer from './MapExplorer'

describe('MapExplorer', () => {
  it('has a TabBar', () => {
    const wrapper = shallow(<MapExplorer storeFetchPostsParam={jest.fn()} fetchPosts={jest.fn()} />)
    expect(wrapper.find('TabBar')).toBeTruthy()
  })

  it('renders a post list', () => {
    const posts = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const wrapper = shallow(<MapExplorer
      storeFetchPostsParam={jest.fn()}
      posts={posts} />)
    expect(wrapper.find('Connect(PostCard)').length).toEqual(3)
  })
})
