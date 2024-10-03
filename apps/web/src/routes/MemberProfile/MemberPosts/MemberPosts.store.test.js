import orm from 'store/models'
import payload from '../MemberProfile.test.json'
import normalized from '../MemberProfile.normalized.test.json'
import {
  fetchMemberPosts,
  getMemberPosts
} from './MemberPosts.store'
import { mapStateToProps } from './MemberPosts.connector'

describe('fetchMemberPosts', () => {
  it('returns the correct action', () => {
    const expected = {
      type: 'FETCH_MEMBER_POSTS',
      graphql: {
        query: 'Give me all the member posts, please.',
        variables: {
          id: '12345',
          first: 10
        }
      },
      meta: { extractModel: 'Person' }
    }
    const { query, variables } = expected.graphql
    const actual = fetchMemberPosts(variables.id, 10, query)
    expect(actual).toEqual(expected)
  })
})

describe('connector', () => {
  let session = null
  let state = null
  let props = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
    const { groups, person, posts } = normalized
    session.Person.create(person)
    session.Group.create(groups[0])
    posts.forEach(post => session.Post.create(post))
    state = { orm: session.state }
    props = { routeParams: { personId: '46816', slug: 'wombats' } }
  })

  describe('getMemberPots', () => {
    it('populates posts correctly', () => {
      const expected = payload.data.person.posts[0]
      const actual = getMemberPosts(state, props)[0]

      expect(actual.id).toEqual(expected.id)
      expect(actual.creator.id).toEqual(expected.creator.id)
      expect(actual.groups[0].id).toEqual(expected.groups[0].id)
    })
  })

  describe('mapStateToProps', () => {
    it('returns a posts array property of the correct length', () => {
      const actual = mapStateToProps(state, props).posts.length
      expect(actual).toBe(2)
    })
  })
})
