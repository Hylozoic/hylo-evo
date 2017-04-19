import orm from 'store/models'
import payload from '../MemberProfile.test.json'
import normalized from '../MemberProfile.normalized.test.json'
import { fetchMemberComments, memberCommentsSelector } from './MemberComments.store'

describe('fetchMemberComments', () => {
  it('returns the correct action', () => {
    const expected = {
      type: 'FETCH_MEMBER_COMMENTS',
      graphql: {
        query: 'Give me all the member comments, please.',
        variables: {
          id: '12345',
          limit: 10,
          order: 'desc'
        }
      }
    }
    const { query, variables } = expected.graphql
    const actual = fetchMemberComments(variables.id, 'desc', 10, query)
    expect(actual).toEqual(expected)
  })
})

describe('memberCommentsSelector', () => {
  let session = null
  let state = null
  let props = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    session.Person.create(normalized.person)
    state = { orm: session.state }
    props = { personId: '46816', slug: 'wombats' }
  })

  it('populates comments correctly', () => {
    session.Post.create(normalized.posts[1])
    session.Comment.create(normalized.comments[0])
    const expected = payload.data.person.comments[0]
    const actual = memberCommentsSelector({ orm: session.state }, props)[0]

    expect(actual.id).toEqual(expected.id)
    expect(actual.creator.id).toEqual(expected.creator.id)
    expect(actual.post.id).toEqual(expected.post.id)
  })
})
