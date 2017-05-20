import MessageForm from './MessageForm'
import { keyMap } from 'util/textInput'
import { shallow, mount } from 'enzyme'
import React from 'react'
import { CREATE_MESSAGE, CREATE_MESSAGE_PENDING } from 'store/constants'
import reducer, {
  createMessage,
  updateMessageText,
  moduleSelector,
  getTextForMessageThread,
  UPDATE_MESSAGE_TEXT
} from './MessageForm.store'

const mockCreateMessage = jest.fn(() => Promise.resolve())
const sendIsTyping = jest.fn()

describe('component', () => {
  const currentUser = {
    id: '1',
    avatarUrl: 'http://image.com/p.png'
  }
  const messageThreadId = '1'
  const wrapper = mount(<MessageForm
    messageThreadId={messageThreadId}
    text='hey you'
    currentUser={currentUser}
    createMessage={mockCreateMessage}
    sendIsTyping={sendIsTyping} />)

  it('matches the latest snapshot', () => {
    const wrapper = shallow(<MessageForm messageThreadId='1' text='hey you' currentUser={currentUser} />)
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

  const wrapper = mount(<MessageForm forNewThread
    findOrCreateThread={mockFindOrCreateThread}
    goToThread={mockGoToThread}
    text='hey you'
    createMessage={mockCreateMessage}
    sendIsTyping={sendIsTyping} />)

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

describe('createMessage', () => {
  const action = createMessage('1', 'hey you')
  it('uses messageThreadId and text as variables in the graphql mutation', () => {
    expect(action.graphql.variables).toEqual({
      messageThreadId: '1',
      text: 'hey you'
    })
  })
  it('behaves optimistically and generates a temp id for each message namespaced to the thread', () => {
    expect(action.meta.optimistic).toBeTruthy()
    expect(action.meta.tempId).toEqual('messageThread1_1')
  })
  it('has action type CREATE_MESSAGE', () => {
    expect(action.type).toEqual(CREATE_MESSAGE)
  })
  it('will use extractModel middleware to pull out the message returned', () => {
    expect(action.meta.extractModel).toEqual('Message')
  })
  it('passes the messageThreadId as metadata', () => {
    expect(action.meta.messageThreadId).toEqual('1')
  })
  it('passes the message text as metadata', () => {
    expect(action.meta.text).toEqual('hey you')
  })
})

describe('updateMessageText', () => {
  const action = updateMessageText('1', 'hey you')
  it('has action type UPDATE_MESSAGE_TEXT', () => {
    expect(action.type).toEqual(UPDATE_MESSAGE_TEXT)
  })
  it('passes the correct metadata', () => {
    expect(action.meta).toEqual({
      messageThreadId: '1',
      text: 'hey you'
    })
  })
})

describe('moduleSelector', () => {
  it('gets the correct sub-state object from the global state', () => {
    const state = {
      MessageForm: {test: 'something'}
    }
    expect(moduleSelector(state)).toEqual({
      test: 'something'
    })
  })
})

describe('getTextForMessageThread', () => {
  it('returns the correct text for a given thread id', () => {
    const state = {
      MessageForm: {
        1: 'trinket'
      }
    }
    const props = {
      messageThreadId: '1'
    }
    expect(getTextForMessageThread(state, props)).toEqual('trinket')
  })
  it('returns an empty string if there is no matching thread id', () => {
    const state = {
      MessageForm: {
        1: 'trinket'
      }
    }
    const props = {
      messageThreadId: '2'
    }
    expect(getTextForMessageThread(state, props)).toEqual('')
  })
})

describe('reducer', () => {
  it('clears the form when CREATE_MESSAGE_PENDING action fires', () => {
    const state = {
      1: 'trinket'
    }
    const action = {
      type: CREATE_MESSAGE_PENDING,
      meta: {
        messageThreadId: '1'
      }
    }
    expect(reducer(state, action)).toEqual({1: ''})
  })
  it('sets the form text for a thread', () => {
    const state = {
      1: ''
    }
    const action = {
      type: UPDATE_MESSAGE_TEXT,
      meta: {
        messageThreadId: '1',
        text: 'biscuit'
      }
    }
    expect(reducer(state, action)).toEqual({1: 'biscuit'})
  })
})
