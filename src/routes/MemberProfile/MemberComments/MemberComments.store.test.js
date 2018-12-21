import orm from 'store/models'
import payload from '../MemberProfile.test.json'
import normalized from '../MemberProfile.normalized.test.json'
import { fetchMemberComments, getMemberComments } from './MemberComments.store'
import { mapStateToProps } from './MemberComments.connector'

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
      },
      meta: { extractModel: 'Person' }
    }
    const { query, variables } = expected.graphql
    const actual = fetchMemberComments(variables.id, 'desc', 10, query)
    expect(actual).toEqual(expected)
  })
})

describe('connector', () => {
  let session = null
  let state = null
  let props = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    session.Person.create(normalized.person)
    session.Post.create(normalized.posts[1])
    session.Comment.create(normalized.comments[0])
    session.Comment.create(normalized.comments[1])
    state = { orm: session.state }
    props = { routeParams: { personId: '46816', slug: 'wombats' } }
  })

  describe('memberPostsSelector', () => {
    it('populates comments correctly', () => {
      const expected = payload.data.person.comments[0]
      const actual = getMemberComments(state, props)[0]

      expect(actual.id).toEqual(expected.id)
      expect(actual.creator.id).toEqual(expected.creator.id)
      expect(actual.post.id).toEqual(expected.post.id)
    })
  })

  describe('mapStateToProps', () => {
    it('returns a comments array property of the correct length', () => {
      const actual = mapStateToProps(state, props).comments.length
      expect(actual).toBe(2)
    })
  })
})
