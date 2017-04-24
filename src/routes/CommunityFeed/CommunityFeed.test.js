import React from 'react'
import { shallow } from 'enzyme'
import CommunityFeed from './CommunityFeed'

describe('CommunityFeed', () => {
  it('renders a Feed with correct props', () => {
    const wrapper = shallow(<CommunityFeed community={{slug: 'foo'}}
      filter='request'
      selectedPostId='5'
      sortBy='votes' />)

    const feed = wrapper.find('Connect(Feed)')
    expect(feed).toHaveLength(1)
    expect(feed.props()).toEqual({
      subject: 'community',
      id: 'foo',
      filter: 'request',
      sortBy: 'votes',
      selectedPostId: '5'
    })
  })
})
