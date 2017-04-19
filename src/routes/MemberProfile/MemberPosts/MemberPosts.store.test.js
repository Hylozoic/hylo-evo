import orm from 'store/models'
import payload from '../MemberProfile.test.json'
import normalized from '../MemberProfile.normalized.test.json'
import { fetchMemberPosts, memberPostsSelector } from './MemberPosts.store'

describe('fetchMemberPosts', () => {
  it('returns the correct action', () => {
    const expected = {
      type: 'FETCH_MEMBER_POSTS',
      graphql: {
        query: 'Give me all the member posts, please.',
        variables: {
          id: '12345',
          limit: 10,
          order: 'desc'
        }
      }
    }
    const { query, variables } = expected.graphql
    const actual = fetchMemberPosts(variables.id, 'desc', 10, query)
    expect(actual).toEqual(expected)
  })
})

describe('memberPostsSelector', () => {
  let session = null
  let state = null
  let props = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
    const { communities, person } = normalized
    session.Person.create(person)
    session.Community.create(communities[0])
    state = { orm: session.state }
    props = { personId: '46816', slug: 'wombats' }
  })

  it('populates posts correctly', () => {
    session.Post.create(normalized.posts[0])
    const expected = payload.data.person.posts[0]
    const actual = memberPostsSelector({ orm: session.state }, props)[0]

    expect(actual.id).toEqual(expected.id)
    expect(actual.creator.id).toEqual(expected.creator.id)
    expect(actual.communities[0].id).toEqual(expected.communities[0].id)
  })
})
