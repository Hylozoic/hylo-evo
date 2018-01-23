import MessageSection from './MessageSection'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { mountWithMockRouter } from 'utils/testing'
import Loading from 'components/Loading'

const person1 = {id: '1', name: 'City Bob'}
const person2 = {id: '2', name: 'Country Alice'}

const messages = [
  {
    id: '1',
    creator: person1,
    text: 'hi!',
    createdAt: '2017-05-19T23:24:58Z'
  },
  {
    id: '2',
    creator: person1,
    text: 'how are you?',
    createdAt: '2017-05-19T23:25:07Z'
  },
  {
    id: '3',
    creator: person1,
    text: 'long time no see',
    createdAt: '2017-05-19T23:33:58Z'
  },
  {
    id: '4',
    creator: person2,
    text: 'i am great',
    createdAt: '2017-05-20T00:11:11Z'
  },
  {
    id: '5',
    creator: person2,
    text: 'things are great',
    createdAt: '2017-05-20T00:12:12Z'
  },
  {
    id: '6',
    creator: person2,
    text: 'so great',
    createdAt: '2017-05-20T00:23:12Z'
  },
  {
    id: '7',
    creator: person1,
    text: 'great!',
    createdAt: '2017-05-20T00:23:27Z'
  }
]

let wrapper, instance, socket

beforeEach(() => {
  socket = {on: jest.fn()}
})

it('renders as expected', () => {
  wrapper = shallow(<MessageSection messages={messages} />, { disableLifecycleMethods: true })
  expect(wrapper).toMatchSnapshot()
})

it('fetches messages when the socket reconnects', () => {
  const reconnectFetchMessages = jest.fn()

  mount(<MessageSection messages={[]} socket={socket}
    reconnectFetchMessages={reconnectFetchMessages} />)

  expect(socket.on).toBeCalled()
  const [ eventName, callback ] = socket.on.mock.calls[0]
  expect(eventName).toBe('reconnect')
  callback()
  expect(reconnectFetchMessages).toBeCalled()
})

it('marks as read when scrolled to bottom by user', () => {
  wrapper = shallow(<MessageSection messages={[]} />, { disableLifecycleMethods: true })
  instance = wrapper.instance()
  jest.spyOn(instance, 'markAsRead')

  instance.handleScroll({
    target: {scrollTop: 1100, scrollHeight: 1200, offsetHeight: 100}
  })
  expect(instance.markAsRead).toBeCalled()
})

describe('when receiving a new message', () => {
  beforeEach(() => {
    // we're using `mount` instead of `shallow` here because we're testing
    // componentDidUpdate, and `setProps` does not trigger `componentDidUpdate`
    // with `shallow` unless you use an experimental flag.
    // https://github.com/airbnb/enzyme/issues/34
    wrapper = mountWithMockRouter(
      <MessageSection messages={[]} socket={socket} currentUser={person1} />)
    instance = wrapper.instance()
    jest.spyOn(instance, 'scrollToBottom')
    jest.spyOn(instance, 'markAsRead')
    instance.list = { offsetHeight: 10, scrollHeight: 100, scrollTop: 0 }
  })

  it('sets shouldScroll to true for new messages', () => {
    wrapper.setProps({ messages })
    expect(wrapper.instance().shouldScroll).toBe(true)
  })

  it('sets shouldScroll to false when new messages at top of array', () => {
    wrapper.setProps({ messages, hasMore: true })
    wrapper.setProps({ messages: [ { id: '99', creator: person2 }, ...messages ] })
    expect(instance.shouldScroll).toBe(false)
  })

  it('sets shouldScroll to true for single message from currentUser', () => {
    wrapper.setProps({ messages: [ { id: '1', creator: person1 } ] })
    expect(instance.shouldScroll).toBe(true)
  })

  it('scrolls but does not mark as read if the page is not visible', () => {
    wrapper.setState({ visible: false })
    wrapper.setProps({ messages })
    expect(instance.scrollToBottom).toBeCalled()
    expect(instance.markAsRead).not.toBeCalled()
  })

  it('sets shouldScroll to false for single message from someone other than currentUser', () => {
    wrapper.setProps({ messages: [ { id: '1', creator: person2 } ] })
    expect(instance.shouldScroll).toBe(false)
  })

  describe('when already scrolled to bottom', () => {
    beforeEach(() => {
      instance.list.scrollTop = 100
    })

    it('sets shouldScroll to true for single message from someone other than currentUser', () => {
      wrapper.setProps({ messages: [ { id: '1', creator: person2 } ] })
      expect(instance.shouldScroll).toBe(true)
    })
  })
})

it('fetches more messages when scrolled to top', () => {
  const fetchMessages = jest.fn()
  wrapper = mountWithMockRouter(
    <MessageSection
      messages={messages}
      socket={socket}
      fetchMessages={fetchMessages} hasMore />)
  wrapper.instance().handleScroll({
    target: {scrollTop: 0, scrollHeight: 1200, offsetHeight: 100}
  })
  expect(fetchMessages).toBeCalled()
})

it('shows Loading component when pending set', () => {
  wrapper = shallow(<MessageSection messages={[]} pending />, { disableLifecycleMethods: true })
  expect(wrapper.find(Loading).length).toBe(1)
})

it('sets visible to false in state when visibility changes', () => {
  wrapper = shallow(<MessageSection messages={[]} pending />, { disableLifecycleMethods: true })
  wrapper.setState({ visible: true })
  // Note that document.hidden always returns true in jsdom
  wrapper.instance().handleVisibilityChange()
  expect(wrapper.state('visible')).toBe(false)
})

it('returns true from atBottom when scrolled to bottom', () => {
  const bottom = { offsetHeight: 10, scrollHeight: 100, scrollTop: 100 }
  wrapper = shallow(<MessageSection messages={[]} />, { disableLifecycleMethods: true })
  const actual = wrapper.instance().atBottom(bottom)
  expect(actual).toBe(true)
})

it('returns false from atBottom when scrolled up', () => {
  const top = { offsetHeight: 10, scrollHeight: 100, scrollTop: 50 }
  wrapper = shallow(<MessageSection messages={[]} />, { disableLifecycleMethods: true })
  const actual = wrapper.instance().atBottom(top)
  expect(actual).toBe(false)
})
