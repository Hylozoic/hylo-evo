import React from 'react'
import { shallow } from 'enzyme'
import Feed from './Feed'

describe('Feed', () => {
  it('has a TabBar', () => {
    const wrapper = shallow(<Feed />)
    expect(wrapper.find('TabBar')).toBeTruthy()
  })

  it('renders a post list', () => {
    const posts = [{id: 1}, {id: 2}, {id: 3}]
    const wrapper = shallow(<Feed posts={posts} />)
    expect(wrapper.find('PostCard').length).toEqual(3)
  })
})
