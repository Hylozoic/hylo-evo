import orm from 'store/models'
import getPost, { presentPost } from 'store/selectors/getPost'

describe('getPost', () => {
  it("returns null if post doesn't exist", () => {
    const session = orm.session(orm.getEmptyState())
    expect(getPost(session.state, {match: {params: {postId: '1'}}})).toEqual(null)
  })

  it('returns the post', () => {
    const postId = 31
    const session = orm.session(orm.getEmptyState())
    session.Post.create({id: postId})
    const result = getPost({orm: session.state}, {match: {params: {postId}}})
    expect(result).toMatchSnapshot()
  })
})

describe('presentPost', () => {
  const communityId = 121
  const postId = 324
  const session = orm.session(orm.getEmptyState())

  const community = session.Community.create({id: communityId})
  const postMembership = session.PostMembership.create({community, pinned: true})
  session.Post.create({id: postId, postMemberships: [postMembership]})

  it('matches the snapshot', () => {
    const post = session.Post.withId(postId)
    const result = presentPost(post, communityId)
    expect(result).toMatchSnapshot(true)
  })
})
