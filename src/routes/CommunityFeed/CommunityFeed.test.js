import React from 'react'
import { shallow } from 'enzyme'
import CommunityFeed from './CommunityFeed'

describe('CommunityFeed', () => {
  it('has a TabBar', () => {
    const wrapper = shallow(<CommunityFeed />)
    expect(wrapper.find('TabBar')).toBeTruthy()
  })

  it('renders a post list', () => {
    const posts = [{id: 1}, {id: 2}, {id: 3}]
    const wrapper = shallow(<CommunityFeed posts={posts} />)
    expect(wrapper.find('PostCard').length).toEqual(3)
  })
})
