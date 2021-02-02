import orm from 'store/models'
import payload from '../MemberProfile.test.json'
import normalized from '../MemberProfile.normalized.test.json'
import { fetchMemberVotes, getMemberVotes } from './MemberVotes.store'
import { mapStateToProps } from './MemberVotes.connector'

describe('fetchMemberVotes', () => {
  it('returns the correct action', () => {
    const expected = {
      type: 'FETCH_MEMBER_VOTES',
      graphql: {
        query: 'Give me all the member votes, please.',
        variables: {
          id: '12345',
          limit: 10,
          order: 'desc'
        }
      },
      meta: { extractModel: 'Person' }
    }
    const { query, variables } = expected.graphql
    const actual = fetchMemberVotes(variables.id, 'desc', 10, query)
    expect(actual).toEqual(expected)
  })
})

describe('connector', () => {
  let session = null
  let state = null
  let props = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    const { groups, person } = normalized
    session.Person.create(person)
    session.group.create(groups[0])
    session.Post.create(normalized.posts[1])
    session.Vote.create(normalized.votes[0])
    state = { orm: session.state }
    props = { routeParams: { personId: '46816', slug: 'wombats' } }
  })

  describe('getMemberVotes', () => {
    it('populates votes correctly (returning the post fk)', () => {
      const expected = payload.data.person.votes[0].post
      const actual = getMemberVotes(state, props)[0]

      expect(actual.id).toEqual(expected.id)
      expect(actual.creator.id).toEqual(expected.creator.id)
      expect(actual.groups[0].id).toEqual(expected.groups[0].id)
    })
  })

  describe('mapStateToProps', () => {
    it('returns a votes property of the correct length', () => {
      const actual = mapStateToProps(state, props).posts.length
      expect(actual).toBe(1)
    })
  })
})
