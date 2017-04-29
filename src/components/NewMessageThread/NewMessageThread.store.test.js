import orm from 'store/models'
import people from './NewMessageThread.test.json'
import reducer, { defaultState, participantsSelector } from './NewMessageThread.store'

describe('connector', () => {
  let session = null
  let state = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    people.forEach(person => session.Person.create(person))
    state = { orm: session.state }
    state.NewMessageThread = { participants: people.map(p => p.id) }
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
    const actual = reducer(undefined, {})
    expect(actual).toEqual(expected)
  })

  it('should handle PEOPLE_SELECTOR_ADD_MATCH', () => {
    const expected = { participants: [ '1' ] }
    const actual = reducer(undefined, {
      type: 'PEOPLE_SELECTOR_ADD_MATCH',
      payload: '1'
    })
    expect(actual).toEqual(expected)
  })

  it('should handle PEOPLE_SELECTOR_DELETE_MATCH', () => {
    const state = { participants: [ '1', '3', '44444', '123454' ] }
    const expected = { participants: [ '1', '3', '123454' ] }
    const actual = reducer(state, {
      type: 'PEOPLE_SELECTOR_DELETE_MATCH',
      payload: '44444'
    })
    expect(actual).toEqual(expected)
  })

  it('should handle PEOPLE_SELECTOR_SET_AUTOCOMPLETE', () => {
    const autocomplete = 'Simone de Beauv'
    const expected = { ...defaultState, autocomplete }
    const actual = reducer(undefined, {
      type: 'PEOPLE_SELECTOR_SET_AUTOCOMPLETE',
      payload: autocomplete
    })
    expect(actual).toEqual(expected)
  })
})
