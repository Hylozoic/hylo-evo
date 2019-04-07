import MessageForm from './MessageForm'
import { keyMap } from 'util/textInput'
import { shallow, mount } from 'enzyme'
import React from 'react'

const messageThreadId = '1'
const currentUser = {
  id: '1',
  avatarUrl: 'http://image.com/p.png'
}

const defaultProps = {
  focusForm: () => {},
  messageThreadId,
  messageText: 'hey you',
  currentUser,
  participants: [],
  createMessage: () => {}
}

describe('component', () => {
  const mockCreateMessage = jest.fn(() => Promise.resolve())
  const sendIsTyping = jest.fn()
  const wrapper = mount(<MessageForm
    {...defaultProps}
    createMessage={mockCreateMessage}
    sendIsTyping={sendIsTyping} />)

  it('matches the latest snapshot', () => {
    const wrapper = shallow(<MessageForm {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('calls startTyping when typing happens', () => {
    wrapper.find('textarea').simulate('keydown')
    expect(sendIsTyping).toHaveBeenCalledWith(true)
  })

  it('does not createMessage when shift-enter is pressed', () => {
    wrapper.find('textarea').simulate('keydown', {which: keyMap.ENTER, shiftKey: true})
    expect(mockCreateMessage).not.toHaveBeenCalled()
  })

  it('does createMessage when enter is pressed', () => {
    wrapper.find('textarea').simulate('keydown', {which: keyMap.ENTER})
    expect(mockCreateMessage.mock.calls[0]).toEqual([messageThreadId, 'hey you'])
  })
})

describe('for a new thread', () => {
  const mockFindOrCreateThread = jest.fn(() => Promise.resolve({
    payload: {data: {findOrCreateThread: {id: 5}}}
  }))

  const mockGoToThread = jest.fn()
  const mockCreateMessage = jest.fn(() => Promise.resolve())

  const wrapper = mount(<MessageForm 
    {...defaultProps}
    forNewThread
    findOrCreateThread={mockFindOrCreateThread}
    goToThread={mockGoToThread}
    text='hey you'
    createMessage={mockCreateMessage}
    sendIsTyping={jest.fn()} />)

  it('finds or creates a thread', () => {
    wrapper.find('textarea').simulate('keydown', {which: keyMap.ENTER})
    expect.assertions(3)
    return new Promise(resolve => {
      setTimeout(() => {
        expect(mockFindOrCreateThread).toHaveBeenCalled()
        expect(mockCreateMessage).toHaveBeenCalled()
        expect(mockGoToThread).toHaveBeenCalledWith(5)
        resolve()
      }, 100)
    })
  })
})
