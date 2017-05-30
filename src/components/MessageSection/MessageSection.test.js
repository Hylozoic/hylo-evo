import MessageSection from './MessageSection'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { mountWithMockRouter } from 'util/testing'

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
  wrapper = shallow(<MessageSection messages={messages} />)
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
  wrapper = shallow(<MessageSection messages={[]} />)
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
    // componentDidUpdate, but `setProps` does not trigger `componentDidUpdate`
    // with `shallow` unless you use an experimental flag.
    // https://github.com/airbnb/enzyme/issues/34
    wrapper = mountWithMockRouter(
      <MessageSection messages={[]} socket={socket} currentUser={person1} />)
    instance = wrapper.instance()
    jest.spyOn(instance, 'scrollToBottom')
    jest.spyOn(instance, 'markAsRead')
  })

  it('sets shouldScroll to true for new messages', () => {
    wrapper.setProps({ messages })
    expect(wrapper.instance().shouldScroll).toBe(true)
  })

  it('sets shouldScroll to false when new messages at top of array', () => {
    wrapper.setProps({ messages })
    wrapper.setProps({ messages: [ { id: '99', creator: person2 }, ...messages ] })
    expect(instance.shouldScroll).toBe(false)
  })

  it('sets shouldScroll to true for single message from currentUser', () => {
    wrapper.setProps({ messages: [ { id: '1', creator: person1 } ] })
    expect(instance.shouldScroll).toBe(true)
  })

  it('sets shouldScroll to false for single message from someone other than currentUser', () => {
    wrapper.setProps({ messages: [ { id: '1', creator: person2 } ] })
    expect(instance.shouldScroll).toBe(false)
  })

  it('scrolls but does not mark as read if the page is not visible', () => {
    wrapper.setState({ visible: false })
    wrapper.setProps({ messages })
    expect(instance.scrollToBottom).toBeCalled()
    expect(instance.markAsRead).not.toBeCalled()
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
