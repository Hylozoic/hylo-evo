import React from 'react'
import { shallow } from 'enzyme'
import Feed from './Feed'

describe('Feed', () => {
  it('renders a Feed with correct props', () => {
    const wrapper = shallow(<Feed communitySlug={'foo'}
      filter='request'
      community={{}}
      selectedPostId='5'
      sortBy='votes' />)

    const feed = wrapper.find('Connect(FeedList)')
    expect(feed).toHaveLength(1)
    expect(feed.props()).toEqual({
      subject: 'community',
      slug: 'foo',
      filter: 'request',
      sortBy: 'votes',
      selectedPostId: '5',
      showCommunities: false,
      topic: undefined
    })
  })

  it('displays the regular FeedBanner if on the main feed', () => {
    const props = {}
    const wrapper = shallow(<Feed {...props} />)
    expect(wrapper.find('FeedBanner')).toHaveLength(1)
    expect(wrapper.find('Connect(TopicFeedHeader)')).toHaveLength(0)
  })

  it('displays the TopicFeedHeader if on a topic feed', () => {
    const props = {
      topicName: 'petitions',
      topic: {id: '5', name: 'petitions'}
    }
    const wrapper = shallow(<Feed {...props} />)
    expect(wrapper.find('FeedBanner')).toHaveLength(0)
    expect(wrapper.find('Connect(TopicFeedHeader)')).toHaveLength(1)
  })
})
