import orm from 'store/models'
import { getMessages } from './MessageSection.store'

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
