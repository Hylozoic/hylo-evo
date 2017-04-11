import React from 'react'
import { shallow } from 'enzyme'
import Feed from './Feed'
import TabBar from './TabBar'

describe('Feed', () => {
  it('has a TabBar', () => {
    const wrapper = shallow(<Feed />)
    const tabBar = <TabBar />
    expect(wrapper.contains(tabBar)).toEqual(true)
  })

  it('renders a post list', () => {
    const posts = [{id: 1}, {id: 2}, {id: 3}]
    const wrapper = shallow(<Feed posts={posts} />)
    expect(wrapper.find('Connect(PostCard)').length).toEqual(3)
  })
})
