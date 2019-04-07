import orm from 'store/models'
import {
  getMessages,
  filterThreadsByParticipant,
  findOrCreateThread
} from './Messages.store'

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
      messageThreadId: '1'
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
      messageThreadId: '1'
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
