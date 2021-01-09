import TopicFeedHeader from './TopicFeedHeader'
import { shallow } from 'enzyme'
import React from 'react'

const topic = { name: 'Petitions' }
const bannerUrl = 'some.url'

const defaultTestProps = {
  topic,
  currentUser: {
    firstName: () => 'anybody'
  }
}

it('matches the latest snapshot', () => {
  const props = {
    ...defaultTestProps,
    group: {
      bannerUrl
    },
    groupTopic: {
      isSubscribed: true
    }
  }
  const wrapper = shallow(<TopicFeedHeader {...props} postsTotal={11} followersTotal={3} />)
  expect(wrapper).toMatchSnapshot()
})

it('displays the topic name', () => {
  const props = {
    ...defaultTestProps,
    groupTopic: {
      isSubscribed: true
    }
  }
  const wrapper = shallow(<TopicFeedHeader {...props} />)
  expect(wrapper.find('[data-stylename="topic-name"]').text()).toEqual('#' + defaultTestProps.topic.name)
})

describe('meta', () => {
  it('uses values of 0 if the meta info is not passed in', () => {
    const props = {
      ...defaultTestProps,
      groupTopic: {
        isSubscribed: true
      }
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="meta"]').text()).toEqual('<Icon />0 subscribers<Icon />0 posts')
  })

  it('correctly pluralizes meta counts when count is 0', () => {
    const props = {
      ...defaultTestProps,
      followersTotal: 0,
      postsTotal: 0,
      groupTopic: {
        isSubscribed: true
      }
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="meta"]').text()).toEqual('<Icon />0 subscribers<Icon />0 posts')
  })

  it('correctly pluralizes counts when count is 1', () => {
    const props = {
      ...defaultTestProps,
      followersTotal: 1,
      postsTotal: 1,
      groupTopic: {
        isSubscribed: true
      }
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="meta"]').text()).toEqual('<Icon />1 subscriber<Icon />1 post')
  })

  it('correctly pluralizes counts when count is greater than 1', () => {
    const props = {
      ...defaultTestProps,
      followersTotal: 2,
      postsTotal: 10,
      groupTopic: {
        isSubscribed: true
      }
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="meta"]').text()).toEqual('<Icon />2 subscribers<Icon />10 posts')
  })
})

describe('subscribe', () => {
  it('shows sub/unsub if group prop is present', () => {
    const props = {
      ...defaultTestProps,
      groupTopic: {},
      group: {
        slug: 'monkeys',
        name: 'Monkey Gang',
        bannerUrl
      }
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="subscribe"]')).toHaveLength(1)
  })

  it('does not show sub/unsub if group prop is not present', () => {
    const props = {
      ...defaultTestProps,
      groupTopic: {
        isSubscribed: false
      }
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="subscribe"]')).toHaveLength(0)
  })

  it('should say Subscribe when not subscribed', () => {
    const props = {
      ...defaultTestProps,
      group: {},
      groupTopic: { isSubscribed: false }
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="subscribe"]').render().text()).toEqual('Subscribe')
  })

  it('should say Unsubscribe when subscribed', () => {
    const props = {
      ...defaultTestProps,
      group: {},
      groupTopic: { isSubscribed: true }
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    expect(wrapper.find('[data-stylename="unsubscribe"]').render().text()).toEqual('Unsubscribe')
  })

  it('calls toggleSubscribe when sub/unsub button is clicked', () => {
    const props = {
      ...defaultTestProps,
      groupTopic: {},
      group: { bannerUrl },
      toggleSubscribe: jest.fn()
    }
    const wrapper = shallow(<TopicFeedHeader {...props} />)
    wrapper.find('[data-stylename="subscribe"]').simulate('click')
    expect(props.toggleSubscribe.mock.calls).toHaveLength(1)
  })
})
