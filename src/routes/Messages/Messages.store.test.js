import orm from 'store/models'
import {
  CREATE_MESSAGE,
  CREATE_MESSAGE_PENDING
} from 'store/constants'
import reducer, {
  getMessages,
  filterThreadsByParticipant,
  findOrCreateThread,
  createMessage,
  updateMessageText,
  moduleSelector,
  getTextForCurrentMessageThread,
  UPDATE_MESSAGE_TEXT
} from './Messages.store'

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
        messageText: 'biscuit'
      }
    }
    expect(reducer(state, action)).toEqual({1: 'biscuit'})
  })
})

describe('getMessages', () => {
  it('should order the messages by their ID', () => {
    const session = orm.mutableSession(orm.getEmptyState())
    session.MessageThread.create({
      id: '1'
    })
    session.Message.create({
      id: '4',
      messageThread: '1'
    })
    session.Message.create({
      id: '10',
      messageThread: '1'
    })
    session.Message.create({
      id: '1',
      messageThread: '1'
    })
    session.Message.create({
      id: '200',
      messageThread: '1'
    })
    const props = {
      match: {
        params: {
          messageThreadId: '1'
        }
      }
    }
    const state = {
      orm: session.state
    }
    const actual = getMessages(state, props)
    expect(actual.map(m => m.id)).toEqual(['1', '4', '10', '200'])
  })

  it('should return empty array if the messageThread is not found', () => {
    const session = orm.mutableSession(orm.getEmptyState())
    const props = {
      match: {
        params: {
          messageThreadId: '1'
        }
      }
    }
    const state = {
      orm: session.state
    }
    const actual = getMessages(state, props)
    expect(actual).toEqual([])
  })
})

describe('filterThreadsByParticipant', () => {
  it('works as expected', () => {
    const mockThread = names => {
      return {
        participants: {
          toRefArray: function () {
            return names.map(name => ({name}))
          }
        }
      }
    }

    const filter = filterThreadsByParticipant('fo')
    expect(filter(mockThread(['boxhead', 'footballface', 'tvnose']))).toBeTruthy()
    expect(filter(mockThread(['Fearsome Foe', 'jim jam']))).toBeTruthy()
    expect(filter(mockThread(['Tiresome toe', 'jim jam']))).toBeFalsy()

    const noFilter = filterThreadsByParticipant()
    expect(noFilter(mockThread(['whomever']))).toBeTruthy()
  })
})

describe('findOrCreateThread', () => {
  it('matches the last snapshot', () => {
    const graphql = {
      query: 'All the lonely people / Where do they all come from?',
      variables: {
        participantIds: ['1', '2', '3']
      }
    }
    const { query, variables } = graphql
    const actual = findOrCreateThread(variables.participantIds, query)
    expect(actual).toMatchSnapshot()
  })
})

describe('createMessage', () => {
  const messageThreadId = '1'
  const text = 'hey you'
  const action = createMessage(messageThreadId, text)
  it('uses messageThreadId and text as variables in the graphql mutation', () => {
    expect(action.graphql.variables.messageThreadId).toEqual(messageThreadId)
    expect(action.graphql.variables.text).toEqual(text)
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
    expect(action.meta.messageText).toEqual('hey you')
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
      messageText: 'hey you'
    })
  })
})

describe('moduleSelector', () => {
  it('gets the correct sub-state object from the global state', () => {
    const state = {
      Messages: {
        test: 'something'
      }
    }
    expect(moduleSelector(state)).toEqual({
      test: 'something'
    })
  })
})

describe('getTextForCurrentMessageThread', () => {
  it('returns the correct text for a given thread id', () => {
    const state = {
      Messages: {
        1: 'trinket'
      }
    }
    const props = {
      match: {
        params: {
          messageThreadId: '1'
        }
      }
    }
    expect(getTextForCurrentMessageThread(state, props)).toEqual('trinket')
  })
  it('returns an empty string if there is no matching thread id', () => {
    const state = {
      Messages: {
        1: 'trinket'
      }
    }
    const props = {
      match: {
        params: {
          messageThreadId: '2'
        }
      }
    }
    expect(getTextForCurrentMessageThread(state, props)).toEqual('')
  })
})
