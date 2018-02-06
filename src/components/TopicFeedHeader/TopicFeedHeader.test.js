import TopicFeedHeader from './TopicFeedHeader'
import { MemoryRouter } from 'react-router'
import { shallow, mount } from 'enzyme'
import React from 'react'

const topic = {name: 'cats'}
const bannerUrl = 'some.url'
it('matches the latest snapshot', () => {
  const props = {
    topic,
    community: {
      bannerUrl
    },
    communityTopic: {
      isSubscribed: true
    }
  }
  const wrapper = shallow(<TopicFeedHeader {...props} postsTotal={11} followersTotal={3} />)
  expect(wrapper).toMatchSnapshot()
})

it('displays the topic name', () => {
  const props = {
    topic: {name: 'Petitions'}
  }
  const wrapper = shallow(<TopicFeedHeader {...props} />)
  expect(wrapper.find('[data-stylename="topic-name"]').text()).toEqual('#Petitions')
})

describe('meta', () => {
  it('uses values of 0 if the meta info is not passed in', () => {
    const props = {topic}
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="meta"]').text()).toEqual('0 subscribers 0 posts')
  })

  it('correctly pluralizes meta counts when count is 0', () => {
    const props = {
      topic,
      followersTotal: 0,
      postsTotal: 0
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="meta"]').text()).toEqual('0 subscribers 0 posts')
  })

  it('correctly pluralizes counts when count is 1', () => {
    const props = {
      topic,
      followersTotal: 1,
      postsTotal: 1
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="meta"]').text()).toEqual('1 subscriber 1 post')
  })

  it('correctly pluralizes counts when count is greater than 1', () => {
    const props = {
      topic,
      followersTotal: 2,
      postsTotal: 10
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="meta"]').text()).toEqual('2 subscribers 10 posts')
  })
})

describe('subscribe', () => {
  it('shows sub/unsub if community prop is present', () => {
    const props = {
      topic,
      communityTopic: {},
      community: {
        slug: 'monkeys',
        name: 'Monkey Gang',
        bannerUrl
      }
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="subscribe"]')).toHaveLength(1)
  })

  it('does not show sub/unsub if community prop is not present', () => {
    const props = {
      topic,
      communityTopic: {
        isSubscribed: false
      }
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="subscribe"]')).toHaveLength(0)
  })

  it('should say Subscribe when not subscribed', () => {
    const props = {
      topic,
      community: {},
      communityTopic: {isSubscribed: false}
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="subscribe"]').render().text()).toEqual('Subscribe')
  })

  it('should say Unsubscribe when subscribed', () => {
    const props = {
      topic,
      community: {bannerUrl},
      communityTopic: {isSubscribed: true}
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="subscribe"]').render().text()).toEqual('Unsubscribe')
  })

  it('calls toggleSubscribe when sub/unsub button is clicked', () => {
    const props = {
      topic,
      communityTopic: {},
      community: {bannerUrl},
      toggleSubscribe: jest.fn()
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    wrapper.find('[data-stylename="subscribe"]').simulate('click')
    expect(props.toggleSubscribe.mock.calls).toHaveLength(1)
  })
})
