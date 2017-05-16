import TopicFeedHeader from './TopicFeedHeader'
import { MemoryRouter } from 'react-router'
import { shallow, mount } from 'enzyme'
import React from 'react'

it('matches the latest snapshot', () => {
  const wrapper = shallow(<TopicFeedHeader postsTotal={11} followersTotal={3} topicName={'petitions'} />)
  expect(wrapper).toMatchSnapshot()
})

it('links to the main community feed if community is passed in', () => {
  const props = {
    community: {
      slug: 'monkeys',
      name: 'Monkey Gang'
    }
  }
  const wrapper = shallow(<TopicFeedHeader {...props} />)
  expect(wrapper.find('Link').prop('to')).toEqual('/c/monkeys')
})

it('links to the All Communities feed if no community is passed in', () => {
  const props = {}
  const wrapper = shallow(<TopicFeedHeader {...props} />)
  expect(wrapper.find('Link').prop('to')).toEqual('/all')
})

it('uses the community name if community is passed in', () => {
  const props = {
    community: {
      slug: 'monkeys',
      name: 'Monkey Gang'
    }
  }
  const wrapper = mount(<MemoryRouter><TopicFeedHeader {...props} /></MemoryRouter>)
  expect(wrapper.find('Link').text()).toEqual(' back to Monkey Gang')
})

it('displays the topic name', () => {
  const props = {
    topicName: 'Petitions'
  }
  const wrapper = shallow(<TopicFeedHeader {...props} />)
  expect(wrapper.find('[data-styleName="topic-name"]').text()).toEqual('#Petitions')
})

describe('meta', () => {
  it('uses values of 0 if the meta info is not passed in', () => {
    const props = {}
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-styleName="meta"]').text()).toEqual('0 posts • 0 followers')
  })

  it('correctly pluralizes meta counts when count is 0', () => {
    const props = {
      followersTotal: 0,
      postsTotal: 0
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-styleName="meta"]').text()).toEqual('0 posts • 0 followers')
  })

  it('correctly pluralizes counts when count is 1', () => {
    const props = {
      followersTotal: 1,
      postsTotal: 1
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-styleName="meta"]').text()).toEqual('1 post • 1 follower')
  })

  it('correctly pluralizes counts when count is greater than 1', () => {
    const props = {
      followersTotal: 2,
      postsTotal: 10
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-styleName="meta"]').text()).toEqual('10 posts • 2 followers')
  })
})

describe('subscribe', () => {
  it('shows sub/unsub if community prop is present', () => {
    const props = {
      community: {
        slug: 'monkeys',
        name: 'Monkey Gang'
      }
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-styleName="subscribe"]')).toHaveLength(1)
  })

  it('does not show sub/unsub if community prop is not present', () => {
    const props = {}
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-styleName="subscribe"]')).toHaveLength(0)
  })

  it('should say Subscribe when no subscription is present', () => {
    const props = {
      community: {}
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-styleName="subscribe"]').render().text()).toEqual('Subscribe')
  })

  it('should say Unsubscribe when a subscription is present', () => {
    const props = {
      community: {},
      subscription: {}
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-styleName="subscribe"]').render().text()).toEqual('Unsubscribe')
  })

  it('calls toggleTopicSubscribe when sub/unsub button is clicked', () => {
    const props = {
      community: {},
      toggleTopicSubscribe: jest.fn()
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    wrapper.find('[data-styleName="subscribe"]').simulate('click')
    expect(props.toggleTopicSubscribe.mock.calls).toHaveLength(1)
  })
})
