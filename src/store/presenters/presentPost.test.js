import orm from 'store/models'
import presentPost from './presentPost'

describe('presentPost', () => {
  const groupId = 121
  const postId = 324
  const session = orm.session(orm.getEmptyState())

  const group = session.group.create({ id: groupId })
  const postMembership = session.PostMembership.create({ group, pinned: true })
  const person = session.Person.create({ name: 'Mr Person' })
  const eventInvitation = session.EventInvitation.create({ response: 'yes', person, event: postId })
  session.Post.create({ id: postId, postMemberships: [postMembership], eventInvitations: [eventInvitation] })

  it('matches the snapshot', () => {
    const post = session.Post.withId(postId)
    const result = presentPost(post, groupId)
    expect(result).toMatchSnapshot(true)
  })
})
