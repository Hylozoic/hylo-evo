import React from 'react'
import { shallow } from 'enzyme'
import Feed, { CreateGroupPrompt } from './Feed'

describe('Feed', () => {
  it('renders a FeedList with correct props', () => {
    const wrapper = shallow(<Feed
      routeParams={{ context: 'groups', groupSlug: 'foo' }}
      postTypeFilter='request'
      group={{ id: 1 }}
      selectedPostId='5'
      sortBy='votes'
      currentUser
      currentUserHasMemberships />)

    const feed = wrapper.find('Connect(Component)')
    expect(feed).toHaveLength(1)
    expect(feed.props()).toEqual({
      routeParams: {
        context: 'groups',
        groupSlug: 'foo'
      },
      groupId: 1,
      querystringParams: {},
      context: 'groups',
      postTypeFilter: 'request',
      sortBy: 'votes',
      selectedPostId: '5',
      topic: undefined
    })
  })

  it('displays the regular StreamBanner if on the main feed', () => {
    const props = {
      currentUser: { id: 1 }
    }
    const wrapper = shallow(<Feed {...props} />)
    expect(wrapper.find('StreamBanner')).toHaveLength(1)
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
    expect(wrapper.find('StreamBanner')).toHaveLength(0)
    expect(wrapper.find('TopicFeedHeader')).toHaveLength(1)
  })
})

describe('CreateGroupPrompt', () => {
  it('matches the latest snapshot', () => {
    const wrapper = shallow(<CreateGroupPrompt
      goToCreateGroup={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
