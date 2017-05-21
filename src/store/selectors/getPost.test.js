import orm from 'store/models'
import getPost from 'store/selectors/getPost'

describe('getPost', () => {
  it("returns null if post doesn't exist", () => {
    const session = orm.session(orm.getEmptyState())
    expect(getPost(session.state, {match: {params: {postId: '1'}}})).toEqual(null)
  })

  it('returns the post with creator, commenters and communities', () => {
    const session = orm.session(orm.getEmptyState())
    const { Post, Person, Community } = session;
    [{
      model: Community, attrs: {id: '1', slug: 'foo'}
    },
    {
      model: Community, attrs: {id: '2', slug: 'bar'}
    },
    {
      model: Community, attrs: {id: '3', slug: 'baz'}
    },
    {
      model: Person, attrs: {id: '1', name: 'Jack'}
    },
    {
      model: Person, attrs: {id: '2'}
    },
    {
      model: Person, attrs: {id: '3', name: 'Sue'}
    },
    {
      model: Post, attrs: {id: '1', title: 'Hay', commenters: ['1'], creator: '3', communities: ['1', '2']}
    },
    {
      model: Post, attrs: {id: '2', commenters: ['2'], creator: '1', communities: ['2', '3']}
    }].forEach(spec => spec.model.create(spec.attrs))

    const result = getPost({orm: session.state}, {match: {params: {postId: '1'}}})
    expect(result).toMatchSnapshot()
  })
})
