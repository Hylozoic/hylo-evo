import orm from 'store/models'
import { mapStateToProps, mapDispatchToProps, mergeProps } from './Messages.connector'

describe('mapStateToProps', () => {
  const session = orm.session(orm.getEmptyState())
  const { MessageThread, Message, Person, Me } = session

  Me.create({
    id: '1'
  })

  const people = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' }
  ]
  people.forEach(x => Person.create(x))

  MessageThread.create({ id: '11' })

  const messages = [
    { id: '4', text: 'hi', creator: '1', messageThread: '11' },
    { id: '5', text: 'how are you', creator: '1', messageThread: '11' },
    { id: '6', text: 'fine thanks', creator: '2', messageThread: '11' },
    { id: '7', text: 'and you?', creator: '2', messageThread: '11' }
  ]
  messages.forEach(x => Message.create(x))

  const state = {
    orm: session.state,
    pending: {
      FETCH_MESSAGES: true
    },
    Messages: {
    },
    PeopleSelector: {
      participants: []
    },
    queryResults: {
      '{"type":"FETCH_MESSAGES","params":{"id":"11"}}': {
        hasMore: true,
        total: 77,
        ids: ['4', '5', '6', '7']
      }
    }
  }

  const props = {
    location: {
      search: ''
    },
    match: {
      params: {
        messageThreadId: '11'
      }
    }
  }

  it('returns expected values', () => {
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('returns expected values', () => {
    const dispatch = () => {}
    const props = {
      match: {
        params: {
          messageThreadId: '7'
        }
      }
    }
    expect(mapDispatchToProps(dispatch, props)).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('returns expected values', () => {
    const stateProps = {
      messages: [
        { id: '1', text: 'hi' }
      ]
    }
    const dispatchProps = {
      fetchMessages: (messageThreadId, { cursor }) => `more messages for thread ${cursor}`,
      updateThreadReadTime: () => {}
    }
    const ownProps = {
      match: {
        params: {
          messageThreadId: '8'
        }
      }
    }
    const props = mergeProps(stateProps, dispatchProps, ownProps)

    expect(props).toMatchSnapshot()
    expect(props.fetchMessages()).toEqual('more messages for thread 1')
  })
})
