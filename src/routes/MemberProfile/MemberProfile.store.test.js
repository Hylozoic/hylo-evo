import orm from 'store/models'
import payload from './MemberProfile.test.json'
import normalized from './MemberProfile.normalized.test.json'
import { fetchPerson, personSelector } from './MemberProfile.store'
import { mapStateToProps } from './MemberProfile.connector'

describe('fetchPerson', () => {
  it('returns the correct action', () => {
    const expected = {
      type: 'FETCH_PERSON',
      graphql: {
        query: 'A very wombaty query.',
        variables: {
          id: '12345'
        }
      },
      meta: { extractModel: 'Person' }
    }
    const { query, variables } = expected.graphql
    const actual = fetchPerson(variables.id, query)
    expect(actual).toEqual(expected)
  })
})

describe('connector', () => {
  let session = null
  let state = null
  let props = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    const { communities, person } = normalized
    session.Person.create(person)
    session.Community.create(communities[0])
    state = { orm: session.state }
    props = { match: { params: { id: '46816', slug: 'wombats' } } }
  })

  describe('personSelector', () => {
    it('returns null for a non-existent person', () => {
      props.match.params.id = '1'
      const actual = personSelector(state, props)
      expect(actual).toBe(null)
    })

    it('returns the correct person', () => {
      const expected = '46816'
      const actual = personSelector(state, props).id
      expect(actual).toBe(expected)
    })

    it('sets role to null if person is not moderator', () => {
      const actual = personSelector(state, props).role
      expect(actual).toBe(null)
    })

    it('adds a role if person is moderator', () => {
      session.Membership.create(normalized.memberships[0])
      const actual = personSelector({ orm: session.state }, props).role
      expect(actual).toBeTruthy()
    })
  })

  describe('mapStateToProps', () => {
    it('sets an error when id missing from route params', () => {
      props.match.params.id = undefined
      const actual = mapStateToProps(state, props)
      expect(actual.error).toBeTruthy()
    })

    it('sets an error when id non-numeric', () => {
      props.match.params.id = 'flargle'
      const actual = mapStateToProps(state, props)
      expect(actual.error).toBeTruthy()
    })

    it('gets the correct person when id included in route params', () => {
      const expected = normalized.person.id
      const actual = mapStateToProps(state, props).person.id
      expect(actual).toEqual(expected)
    })
  })
})
