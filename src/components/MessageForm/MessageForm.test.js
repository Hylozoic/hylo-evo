import MessageForm from './MessageForm'
import { socketUrl } from 'client/websockets'
import { keyMap } from 'util/textInput'
import { shallow, mount } from 'enzyme'
import React from 'react'

it('to match the latest snapshot', () => {
  const currentUser = {
    id: '1',
    avatarUrl: 'http://image.com/p.png'
  }
  const wrapper = shallow(<MessageForm messageThreadId={'1'} text='hey you' currentUser={currentUser} />)
  expect(wrapper).toMatchSnapshot()
})

describe('MessageForm', () => {
  const currentUser = {
    id: '1',
    avatarUrl: 'http://image.com/p.png'
  }
  const socket = {
    post: jest.fn()
  }
  const messageThreadId = '1'
  const createMessage = jest.fn()
  const wrapper = mount(<MessageForm
    messageThreadId={messageThreadId}
    text='hey you'
    currentUser={currentUser}
    socket={socket}
    createMessage={createMessage} />)

  it('to send startTyping when typing happens', () => {
    wrapper.find('textarea').simulate('keydown')
    const expectedSocketUrl = socketUrl(`/noo/post/1/typing`)
    const expectedTypingValue = { isTyping: true }
    expect(socket.post.mock.calls[0][0]).toEqual(expectedSocketUrl)
    expect(socket.post.mock.calls[0][1]).toEqual(expectedTypingValue)
  })

  it('to not createMessage when enter with shift is pressed', () => {
    wrapper.find('textarea').simulate('keydown', {which: keyMap.ENTER, shiftKey: true})
    expect(createMessage).not.toHaveBeenCalled()
  })

  it('to createMessage when enter (no shift) is pressed', () => {
    wrapper.find('textarea').simulate('keydown', {which: keyMap.ENTER})
    expect(createMessage.mock.calls[0]).toEqual([messageThreadId, 'hey you', currentUser.id])
  })
})
