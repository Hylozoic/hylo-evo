import MessageSection from './MessageSection'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { mountWithMockRouter } from 'util/testing'

const person1 = {id: 1, name: 'City Bob'}
const person2 = {id: 2, name: 'Country Alice'}

const messages = [
  {
    id: 1,
    creator: person1,
    text: 'hi!',
    createdAt: '2017-05-19T23:24:58Z'
  },
  {
    id: 2,
    creator: person1,
    text: 'how are you?',
    createdAt: '2017-05-19T23:25:07Z'
  },
  {
    id: 3,
    creator: person1,
    text: 'long time no see',
    createdAt: '2017-05-19T23:33:58Z'
  },
  {
    id: 4,
    creator: person2,
    text: 'i am great',
    createdAt: '2017-05-20T00:11:11Z'
  },
  {
    id: 5,
    creator: person2,
    text: 'things are great',
    createdAt: '2017-05-20T00:12:12Z'
  },
  {
    id: 6,
    creator: person2,
    text: 'so great',
    createdAt: '2017-05-20T00:23:12Z'
  },
  {
    id: 7,
    creator: person1,
    text: 'great!',
    createdAt: '2017-05-20T00:23:27Z'
  }
]

var wrapper, instance, socket

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

it('changes state when scrolled away from bottom', () => {
  wrapper = shallow(<MessageSection messages={[]} />)
  wrapper.instance().handleScroll({
    target: {scrollTop: 1000, scrollHeight: 1200, offsetHeight: 100}
  })

  expect(wrapper.state('scrolledUp')).toBeTruthy()
})

it('marks as read when scrolled to bottom by user', () => {
  wrapper = shallow(<MessageSection messages={[]} />)
  instance = wrapper.instance()
  jest.spyOn(instance, 'markAsRead')

  wrapper.setState({scrolledUp: true})
  instance.handleScroll({
    target: {scrollTop: 1100, scrollHeight: 1200, offsetHeight: 100}
  })

  expect(wrapper.state('scrolledUp')).toBeFalsy()
  expect(instance.markAsRead).toBeCalled()
})

describe('when receiving a new message', () => {
  beforeEach(() => {
    // we're using `mount` instead of `shallow` here because we're testing
    // componentDidUpdate, but `setProps` does not trigger `componentDidUpdate`
    // with `shallow` unless you use an experimental flag.
    // https://github.com/airbnb/enzyme/issues/34
    wrapper = mountWithMockRouter(
      <MessageSection messages={[]} socket={socket} currentUser={{id: '1'}} />)
    instance = wrapper.instance()
    jest.spyOn(instance, 'scrollToBottom')
    jest.spyOn(instance, 'markAsRead')
  })

  it('scrolls to bottom and marks as read if already at bottom', () => {
    wrapper.setProps({messages: [
      {id: '1', text: 'hi', creator: {id: '2'}}
    ]})
    expect(instance.scrollToBottom).toBeCalled()
    expect(instance.markAsRead).toBeCalled()
  })

  it('does not scroll if not already at bottom', () => {
    wrapper.setState({scrolledUp: true})
    wrapper.setProps({messages: [
      {id: '1', text: 'hi', creator: {id: '2'}}
    ]})
    expect(instance.scrollToBottom).not.toBeCalled()
    expect(instance.markAsRead).not.toBeCalled()
  })

  it('scrolls but does not mark as read if the page is not visible', () => {
    wrapper.setState({visible: false})
    wrapper.setProps({messages: [
      {id: '1', text: 'hi', creator: {id: '2'}}
    ]})
    expect(instance.scrollToBottom).toBeCalled()
    expect(instance.markAsRead).not.toBeCalled()
  })
})

describe('when scrolled to top', () => {
  let fetchMessages

  beforeEach(() => {
    fetchMessages = jest.fn(() => Promise.resolve())
    wrapper = mountWithMockRouter(
      <MessageSection
        messages={[
          {id: '7', text: 'hi', creator: {id: '8'}}
        ]}
        socket={socket}
        fetchMessages={fetchMessages} hasMore />)
    instance = wrapper.instance()
    jest.spyOn(instance, 'fetchMore')
    jest.spyOn(instance, 'scrollToMessage')
    instance.list = {}

    jest.spyOn(document, 'querySelector').mockImplementation(selector => {
      if (selector === '[data-message-id="7"]') {
        return {
          offsetLeft: 0,
          clientLeft: 0,
          offsetTop: 0,
          clientTop: 0,
          offsetParent: instance.list
        }
      }

      if (selector === '#thread-header') {
        return {offsetHeight: 70}
      }

      throw new Error(`unknown selector: ${selector}`)
    })
  })

  it('fetches more messages', () => {
    instance.handleScroll({
      target: {scrollTop: 0, scrollHeight: 1200, offsetHeight: 100}
    })

    expect.assertions(3)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          expect(instance.fetchMore).toBeCalled()
          expect(fetchMessages).toBeCalled()
          expect(instance.scrollToMessage).toBeCalledWith('7')
          resolve()
        } catch (err) {
          reject(err)
        }
      }, 10)
    })
  })
})
