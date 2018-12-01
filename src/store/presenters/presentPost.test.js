import orm from 'store/models'
import presentPost from './presentPost'

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
