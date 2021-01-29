import React from 'react'
import { shallow } from 'enzyme'
import Feed, { CreateCommunityPrompt } from './Feed'

describe('Feed', () => {
  it('renders a FeedList with correct props', () => {
    const wrapper = shallow(<Feed
      routeParams={{ slug: 'foo' }}
      postTypeFilter='request'
      community={{}}
      selectedPostId='5'
      sortBy='votes'
      currentUser
      currentUserHasMemberships />)

    const feed = wrapper.find('Connect(Component)')
    expect(feed).toHaveLength(1)
    expect(feed.props()).toEqual({
      routeParams: {
        slug: 'foo'
      },
      querystringParams: {},
      subject: 'community',
      postTypeFilter: 'request',
      sortBy: 'votes',
      selectedPostId: '5',
      topic: undefined
    })
  })

  it('with a network it renders a Feed with correct props', () => {
    const wrapper = shallow(<Feed
      routeParams={{ networkSlug: 'bar' }}
      postTypeFilter='request'
      network={{ id: 2 }}
      fetchNetwork={jest.fn()}
      sortBy='votes'
      currentUser
      currentUserHasMemberships />)

    expect(wrapper).toMatchSnapshot()

    const feed = wrapper.find('Connect(Component)')
    expect(feed).toHaveLength(1)
    expect(feed.props()).toEqual({
      routeParams: { networkSlug: 'bar' },
      querystringParams: {},
      subject: 'network',
      postTypeFilter: 'request',
      sortBy: 'votes',
      topic: undefined
    })
  })

  it('displays the regular FeedBanner if on the main feed', () => {
    const props = {
      currentUser: { id: 1 }
    }
    const wrapper = shallow(<Feed {...props} />)
    expect(wrapper.find('FeedBanner')).toHaveLength(1)
    expect(wrapper.find('Connect(TopicFeedHeader)')).toHaveLength(0)
  })

  it('displays the TopicFeedHeader if on a topic feed', () => {
    const props = {
      routeParams: {
        topicName: 'petitions'
      },
      topic: { id: '5', name: 'petitions' },
      currentUser: { id: 1 }
    }
    const wrapper = shallow(<Feed {...props} fetchTopic={jest.fn()} />)
    expect(wrapper.find('FeedBanner')).toHaveLength(0)
    expect(wrapper.find('TopicFeedHeader')).toHaveLength(1)
  })
})

describe('CreateCommunityPrompt', () => {
  it('matches the latest snapshot', () => {
    const wrapper = shallow(<CreateCommunityPrompt
      goToCreateCommunity={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
