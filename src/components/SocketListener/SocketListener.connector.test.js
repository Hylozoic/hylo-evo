import { mapDispatchToProps } from './SocketListener.connector'

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

const legacyThreadData = {
  id: '89',
  created_at: '2017-05-13T01:01:14.202Z',
  updated_at: '2017-05-13T01:01:14.202Z',
  people: [
    {id: '1', name: 'Foo', avatar_url: 'foo.png'},
    {id: '2', name: 'Bar', avatar_url: 'bar.png'},
    {id: '3', name: 'Zot', avatar_url: 'zot.png'}
  ],
  comments: [
    legacyCommentData.comment
  ]
}

// just a placeholder for a real test
it('returns the expected value', () => {
  const dispatch = jest.fn(x => x)
  const props = {location: {pathname: '/t/77'}}
  const newProps = mapDispatchToProps(dispatch, props)
  expect(newProps).toMatchSnapshot()

  const { receiveComment, receiveMessage, receiveThread } = newProps

  expect(receiveComment(legacyCommentData)).toMatchSnapshot()
  expect(receiveMessage(legacyMessageData)).toMatchSnapshot()
  expect(receiveThread(legacyThreadData)).toMatchSnapshot()
})
