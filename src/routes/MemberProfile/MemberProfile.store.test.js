import orm from 'store/models'
import testData from './MemberProfile.normalized.test.json'
import { getPresentedPerson } from './MemberProfile.store'
import { mapStateToProps } from './MemberProfile.connector'

describe('connector', () => {
  let session, state, selectorProps, props

  beforeEach(() => {
    const {
      groups,
      person
    } = testData
    session = orm.mutableSession(orm.getEmptyState())
    session.Person.create(person)
    session.Group.create(groups[0])
    state = { orm: session.state }
    selectorProps = {
      personId: '46816',
      slug: 'wombats'
    }
    props = {
      match: {
        params: selectorProps
      }
    }
  })

  describe('getPresentedPerson', () => {
    it('returns null for a non-existent person', () => {
      selectorProps.personId = '1'
      const actual = getPresentedPerson(state, selectorProps)
      expect(actual).toBe(null)
    })

    it('returns the correct person', () => {
      const expected = '46816'
      const actual = getPresentedPerson(state, selectorProps).id
      expect(actual).toBe(expected)
    })

    it('sets role to null if person is not moderator', () => {
      const actual = getPresentedPerson(state, selectorProps).role
      expect(actual).toBe(null)
    })

    it('adds a role if person is moderator', () => {
      session.Membership.create(testData.memberships[0])
      const actual = getPresentedPerson({ orm: session.state }, selectorProps).role
      expect(actual).toBeTruthy()
    })
  })

  describe('mapStateToProps', () => {
    it('sets an error when id missing from route params', () => {
      props.match.params.personId = undefined
      const actual = mapStateToProps(state, props)
      expect(actual.error).toBeTruthy()
    })

    it('sets an error when id non-numeric', () => {
      props.match.params.personId = 'flargle'
      const actual = mapStateToProps(state, props)
      expect(actual.error).toBeTruthy()
    })

    it('gets the correct person when id included in route params', () => {
      const expected = testData.person.id
      const actual = mapStateToProps(state, props).person.id
      expect(actual).toEqual(expected)
    })
  })
})
