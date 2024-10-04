import { mapDispatchToProps } from './SocketListener.connector'
import timezoneMock from 'timezone-mock'

const commentData = {
  createdAt: '2017-05-13T01:21:14.202Z',
  id: '24738',
  text: '<p>clunk</p>',
  creator: {
    id: '13249',
    name: 'foo',
    avatarUrl: 'foo.png'
  },
  post: '22498'
}

const legacyCommentData = {
  comment: {
    created_at: '2017-05-13T01:21:14.202Z',
    id: '24738',
    text: '<p>clunk</p>',
    user_id: '13249'
  },
  postId: '22498'
}

const legacyMessageData = {
  message: {
    id: '5',
    created_at: '2017-05-13T01:21:14.202Z',
    text: 'hello!',
    user_id: '5557'
  },
  postId: '8'
}

const messageData = {
  id: '5',
  createdAt: '2017-05-13T01:21:14.202Z',
  text: 'hello!',
  creator: '5557',
  messageThread: '8'
}

const legacyThreadData = {
  id: '89',
  created_at: '2017-05-13T01:01:14.202Z',
  updated_at: '2017-05-13T01:01:14.202Z',
  people: [
    { id: '1', name: 'Foo', avatar_url: 'foo.png' },
    { id: '2', name: 'Bar', avatar_url: 'bar.png' },
    { id: '3', name: 'Zot', avatar_url: 'zot.png' }
  ],
  comments: [
    legacyCommentData.comment
  ]
}

const threadData = {
  id: '89',
  createdAt: '2017-05-13T01:01:14.202Z',
  updatedAt: '2017-05-13T01:01:14.202Z',
  participants: [
    { id: '1', name: 'Foo', avatarUrl: 'foo.png' },
    { id: '2', name: 'Bar', avatarUrl: 'bar.png' },
    { id: '3', name: 'Zot', avatarUrl: 'zot.png' }
  ],
  messages: [
    {
      ...commentData,
      creator: commentData.creator.id
    }
  ]
}

let newProps

beforeAll(() => {
  timezoneMock.register('US/Pacific')
  const dispatch = jest.fn(x => x)
  const props = { location: { pathname: '/messages/77' } }
  newProps = mapDispatchToProps(dispatch, props)
})

afterAll(() => {
  timezoneMock.unregister()
})

it('returns the expected value', () => {
  expect(newProps).toMatchSnapshot()
})

it('receives comments', () => {
  expect(newProps.receiveComment(commentData)).toMatchSnapshot()
})

it('receives messages', () => {
  const receiveOldMessage = newProps.receiveMessage(legacyMessageData)
  expect(receiveOldMessage).toMatchSnapshot()

  const receiveNewMessage = newProps.receiveMessage(messageData)
  expect(receiveOldMessage).toEqual(receiveNewMessage)
})

it('receives threads', () => {
  const receiveOldThread = newProps.receiveThread(legacyThreadData)
  expect(receiveOldThread).toMatchSnapshot()

  const receiveNewThread = newProps.receiveThread(threadData)
  expect(receiveOldThread).toEqual(receiveNewThread)
})
