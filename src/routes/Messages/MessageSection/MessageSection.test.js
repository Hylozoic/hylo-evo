import React from 'react'
import { mount, shallow } from 'enzyme'
import { MemoryRouter } from 'react-router'
import Loading from 'components/Loading'
import MessageSection from './MessageSection'

const person1 = { id: '1', name: 'City Bob', avatarUrl: '' }
const person2 = { id: '2', name: 'Country Alice', avatarUrl: '' }

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
  socket = { on: jest.fn() }
})

it('renders as expected', () => {
  wrapper = shallow(<MessageSection messages={messages} fetchMessages={() => {}} />, { disableLifecycleMethods: true })
  expect(wrapper).toMatchSnapshot()
})

it('fetches messages when the socket reconnects', () => {
  const fetchMessages = jest.fn()

  mount(<MessageSection messages={[]} socket={socket}
    fetchMessages={fetchMessages} />)

  expect(socket.on).toBeCalled()
  const [ eventName, callback ] = socket.on.mock.calls[0]
  expect(eventName).toBe('reconnect')
  callback()
  expect(fetchMessages).toBeCalled()
})

it('marks as read when scrolled to bottom by user', () => {
  wrapper = shallow(<MessageSection messages={[]} fetchMessages={() => {}} />, { disableLifecycleMethods: true })
  instance = wrapper.instance()
  jest.spyOn(instance, 'markAsRead')

  instance.handleScroll({
    target: { scrollTop: 1100, scrollHeight: 1200, offsetHeight: 100 }
  })
  expect(instance.markAsRead).toBeCalled()
})

describe('when receiving a new message', () => {
  beforeEach(() => {
    const Proxy = options => (
      <MemoryRouter>
        <MessageSection {...options} />
      </MemoryRouter>
    )
    const wrapper = mount(
      <Proxy
        fetchMessages={() => {}}
        messages={[]}
        socket={socket}
        currentUser={person1}
      />
    )
    instance = wrapper.find(MessageSection).instance()
    jest.spyOn(instance, 'scrollToBottom')
    jest.spyOn(instance, 'markAsRead')
    instance.list.current = { offsetHeight: 10, scrollHeight: 100, scrollTop: 0 }
  })

  it('sets shouldScroll to true for new messages', () => {
    wrapper.setProps({ messages })
    expect(instance.shouldScroll).toBe(true)
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
      instance.list.current.scrollTop = 100
    })

    it('sets shouldScroll to true for single message from someone other than currentUser', () => {
      wrapper.setProps({ messages: [ { id: '1', creator: person2 } ] })
      expect(instance.shouldScroll).toBe(true)
    })
  })
})

it('fetches more messages when scrolled to top', () => {
  const fetchMessages = jest.fn()
  const Proxy = options => (
    <MemoryRouter>
      <MessageSection {...options} />
    </MemoryRouter>
  )
  const wrapper = mount(
    <Proxy
      messages={messages}
      socket={socket}
      fetchMessages={fetchMessages}
      hasMore
    />
  )
  wrapper.find(MessageSection).instance().handleScroll({
    target: { scrollTop: 0, scrollHeight: 1200, offsetHeight: 100 }
  })
  expect(fetchMessages).toBeCalled()
})

it('shows Loading component when pending set', () => {
  wrapper = shallow(<MessageSection messages={[]} fetchMessages={() => {}} pending />, { disableLifecycleMethods: true })
  expect(wrapper.find(Loading).length).toBe(1)
})

it('sets visible to false in state when visibility changes', () => {
  wrapper = shallow(<MessageSection messages={[]} fetchMessages={() => {}} pending />, { disableLifecycleMethods: true })
  wrapper.setState({ visible: true })
  // jsdom document.hidden was false, force it to hidden and make it settable for this test
  let hidden = true
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    get () { return hidden },
    set (bool) { hidden = Boolean(bool) }
  })
  wrapper.instance().handleVisibilityChange()
  expect(wrapper.state('visible')).toBe(false)
})

it('returns true from atBottom when scrolled to bottom', () => {
  const bottom = { offsetHeight: 10, scrollHeight: 100, scrollTop: 100 }
  wrapper = shallow(<MessageSection messages={[]} fetchMessages={() => {}} />, { disableLifecycleMethods: true })
  const actual = wrapper.instance().atBottom(bottom)
  expect(actual).toBe(true)
})

it('returns false from atBottom when scrolled up', () => {
  const top = { offsetHeight: 10, scrollHeight: 100, scrollTop: 50 }
  wrapper = shallow(<MessageSection messages={[]} fetchMessages={() => {}} />, { disableLifecycleMethods: true })
  const actual = wrapper.instance().atBottom(top)
  expect(actual).toBe(false)
})
