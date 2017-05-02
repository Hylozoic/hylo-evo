import orm from 'store/models'
import reducer, {
  addParticipant,
  defaultState,
  fetchPeople,
  participantsSelector,
  removeParticipant
} from './PeopleSelector.store'
import people from './PeopleSelector.test.json'
import { mapStateToProps } from './PeopleSelector.connector'

describe('fetchPeople', () => {
  it('returns the correct action', () => {
    const expected = {
      type: 'FETCH_PEOPLE',
      graphql: {
        query: 'All the lonely people / Where do they all come from?',
        variables: {
          autocomplete: 'Tchaikovs',
          first: 100
        }
      },
      meta: { extractModel: 'Person' }
    }
    const { query, variables } = expected.graphql
    const actual = fetchPeople(variables.autocomplete, query, variables.first)
    expect(actual).toEqual(expected)
  })
})

it('addParticipant returns the correct action', () => {
  const expected = {
    type: 'PEOPLE_SELECTOR_ADD_PARTICIPANT',
    payload: '1'
  }
  const actual = addParticipant('1')
  expect(actual).toEqual(expected)
})

it('removeParticipant returns the correct action', () => {
  const expected = {
    type: 'PEOPLE_SELECTOR_REMOVE_PARTICIPANT',
    payload: '1'
  }
  const actual = removeParticipant('1')
  expect(actual).toEqual(expected)
})

describe('connector', () => {
  let session = null
  let state = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    people.forEach(person => session.Person.create(person))
    state = { orm: session.state }
    state.PeopleSelector = { participants: people.map(p => p.id) }
  })

  describe('participantsSelector', () => {
    it('returns the correct objects', () => {
      const expected = people.map(p => ({
        id: p.id,
        name: p.name,
        avatarUrl: p.avatarUrl
      }))
      const actual = participantsSelector(state)
      expect(actual).toEqual(expected)
    })
  })
})

describe('reducer', () => {
  it('should return the initial state', () => {
    const expected = defaultState
    const actual = reducer(undefined, { type: 'FLARGLE' })
    expect(actual).toEqual(expected)
  })

  it('should handle PEOPLE_SELECTOR_ADD_PARTICIPANT', () => {
    const expected = { participants: [ '1' ] }
    const actual = reducer(defaultState, {
      type: 'PEOPLE_SELECTOR_ADD_PARTICIPANT',
      payload: '1'
    })
    expect(actual).toEqual(expected)
  })

  it('should handle PEOPLE_SELECTOR_REMOVE_PARTICIPANT', () => {
    const state = { participants: [ '1', '3', '44444', '123454' ] }
    const expected = { participants: [ '1', '3', '123454' ] }
    const actual = reducer(state, {
      type: 'PEOPLE_SELECTOR_REMOVE_PARTICIPANT',
      payload: '44444'
    })
    expect(actual).toEqual(expected)
  })
})
