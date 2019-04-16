import { mapStateToProps } from './PostImage.connector'
import orm from 'store/models'

let state

beforeEach(() => {
  const session = orm.session(orm.getEmptyState())
  session.Attachment.create({ id: '1', type: 'image', url: 'foo', post: '5' })
  session.Attachment.create({ id: '2', type: 'image', url: 'bar', post: '5' })
  session.Attachment.create({ id: '3', type: 'image', url: 'baz', post: '5' })
  session.Attachment.create({ id: '4', type: 'image', url: 'bonk', post: '5' })
  session.Attachment.create({ id: '5', type: 'image', url: 'nope', post: '4' })
  session.Attachment.create({ id: '5', type: 'doc', url: 'nope', post: '5' })
  state = { orm: session.state }
})

it('prepares a list of images for the component', () => {
  const props = { postId: '5' }
  expect(mapStateToProps(state, props)).toMatchSnapshot()
})
