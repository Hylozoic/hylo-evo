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
  updateMessageText: () => {},
  onSubmit: () => {}
}

describe('component', () => {
  const mockOnSubmit = jest.fn(() => Promise.resolve())
  const sendIsTyping = jest.fn()
  const wrapper = mount(<MessageForm
    {...defaultProps}
    onSubmit={mockOnSubmit}
    sendIsTyping={sendIsTyping} />)

  it('matches the latest snapshot', () => {
    const wrapper = shallow(<MessageForm {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('calls startTyping when typing happens', () => {
    wrapper.find('textarea').simulate('keydown')
    expect(sendIsTyping).toHaveBeenCalledWith(true)
  })

  it('does not run onSubmit when shift-enter is pressed', () => {
    wrapper.find('textarea').simulate('keydown', { which: keyMap.ENTER, shiftKey: true })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('does onSubmit when enter is pressed', () => {
    wrapper.find('textarea').simulate('keydown', { which: keyMap.ENTER })
    expect(mockOnSubmit).toHaveBeenCalled()
  })
})
