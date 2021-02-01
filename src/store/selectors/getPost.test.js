import orm from 'store/models'
import getPost from 'store/selectors/getPost'

describe('getPost', () => {
  it("returns null if post doesn't exist", () => {
    const session = orm.session(orm.getEmptyState())
    expect(getPost({ orm: session.state }, { match: { params: { postId: '1' } } })).toEqual(null)
  })
})
