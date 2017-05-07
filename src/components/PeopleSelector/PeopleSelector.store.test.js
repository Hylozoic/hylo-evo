import { pick } from 'lodash/fp'

import orm from 'store/models'
import reducer, * as store from './PeopleSelector.store'
import people from './PeopleSelector.test.json'
import { mapStateToProps, getParticipantSearch } from './PeopleSelector.connector'

describe('fetchPeople', () => {
  it('returns the correct action', () => {
    const expected = {
      type: store.FETCH_PEOPLE,
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
    const actual = store.fetchPeople(variables.autocomplete, query, variables.first)
    expect(actual).toEqual(expected)
  })
})

it('returns the correct action from addParticipant', () => {
  const expected = {
    type: store.ADD_PARTICIPANT,
    payload: '1'
  }
  const actual = store.addParticipant('1')
  expect(actual).toEqual(expected)
})

it('returns the correct action from removeParticipant', () => {
  const expected = {
    type: store.REMOVE_PARTICIPANT,
    payload: '1'
  }
  const actual = store.removeParticipant('1')
  expect(actual).toEqual(expected)
})

it('returns the correct action from setAutocomplete', () => {
  const expected = {
    type: store.SET_AUTOCOMPLETE,
    payload: 'flargle'
  }
  const actual = store.setAutocomplete('flargle')
  expect(actual).toEqual(expected)
})

describe('getParticipantSearch', () => {
  it('returns the correct id', () => {
    const location = { search: '?participants=12345' }
    const expected = [ '12345' ]
    const actual = getParticipantSearch({ location }, [])
    expect(actual).toEqual(expected)
  })

  it('returns null if no search', () => {
    const actual = getParticipantSearch({ location: { search: '' } })
    expect(actual).toBe(null)
  })

  it('filters out ids from store', () => {
    const location = { search: '?participants=1,2,3,4' }
    const expected = [ '1', '2', '4' ]
    const actual = getParticipantSearch({ location }, [ '3' ])
    expect(actual).toEqual(expected)
  })
})

describe('connector', () => {
  let session = null
  let state = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    people.forEach(person => {
      session.Person.create({
        ...person,
        memberships: person.memberships.map(m => m.id)
      })
      session.Membership.create({
        ...person.memberships[0],
        community: person.memberships[0].community.id
      })
      session.Community.create(person.memberships[0].community)
    })
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
      const actual = store.participantsSelector(state)
      expect(actual).toEqual(expected)
    })
  })

  describe('participantsFromStore', () => {
    it('returns the participants array from store', () => {
      const expected = state.PeopleSelector.participants
      const actual = store.participantsFromStore(state)
      expect(actual).toEqual(expected)
    })
  })

  describe('matchesSelector', () => {
    it('returns empty array if autocomplete is missing', () => {
      const actual = store.matchesSelector(state)
      expect(actual).toEqual([])
    })

    it('returns the correct objects by matching autocomplete', () => {
      state.PeopleSelector.participants = []
      state.PeopleSelector.autocomplete = 'BR'
      const expected = [
        {
          "id": "72203",
          "name": "Brooks Funk",
          "avatarUrl": "https://s3.amazonaws.com/uifaces/faces/twitter/matthewkay_/128.jpg",
          "community": "Associate"
        },
        {
          "id": "72019",
          "name": "Vita Breitenberg",
          "avatarUrl": "https://s3.amazonaws.com/uifaces/faces/twitter/markjenkins/128.jpg",
          "community": "Associate"
        }
      ]
      const actual = store.matchesSelector(state)
      expect(actual).toEqual(expected)
    })

    it('does not return objects whose ids are already in participants', () => {
      state.PeopleSelector.participants = [ '72019' ]
      state.PeopleSelector.autocomplete = 'BR'
      const expected = [
        {
          "id": "72203",
          "name": "Brooks Funk",
          "avatarUrl": "https://s3.amazonaws.com/uifaces/faces/twitter/matthewkay_/128.jpg",
          "community": "Associate"
        }
      ]
      const actual = store.matchesSelector(state)
      expect(actual).toEqual(expected)
    })
  })

  describe('mapStateToProps', () => {
    it('returns the correct object', () => {
      state.PeopleSelector.participants = [ '72203' ]
      const expected = {
        autocomplete: undefined,
        contacts: people
          .map(p => ({
            ...pick([ 'id', 'name', 'avatarUrl' ], p),
            community: p.memberships[0].community.name
          }))
          .filter(p => p.id !== '72203'),
        matches: [],
        participantSearch: null,
        participants: [
          {
            "id": "72203",
            "name": "Brooks Funk",
            "avatarUrl": "https://s3.amazonaws.com/uifaces/faces/twitter/matthewkay_/128.jpg"
          }
        ]
      }
      const actual = mapStateToProps(state, { location: { search: '' } })
      expect(actual).toEqual(expected)
    })
  })
})

describe('reducer', () => {
  it('should return the initial state', () => {
    const expected = store.defaultState
    const actual = reducer(undefined, { type: 'FLARGLE' })
    expect(actual).toEqual(expected)
  })

  it('should handle PeopleSelector/ADD_PARTICIPANT', () => {
    const expected = { participants: [ '1' ] }
    const actual = reducer(store.defaultState, {
      type: store.ADD_PARTICIPANT,
      payload: '1'
    })
    expect(actual).toEqual(expected)
  })

  it('should handle PeopleSelector/REMOVE_PARTICIPANT', () => {
    const state = { participants: [ '1', '3', '44444', '123454' ] }
    const expected = { participants: [ '1', '3', '123454' ] }
    const actual = reducer(state, {
      type: store.REMOVE_PARTICIPANT,
      payload: '44444'
    })
    expect(actual).toEqual(expected)
  })

  it('should remove the last participant if REMOVE_PARTICIPANT payload is undefined', () => {
    const state = { participants: [ '1', '3', '44444', '123454' ] }
    const expected = { participants: [ '1', '3', '44444' ] }
    const actual = reducer(state, { type: store.REMOVE_PARTICIPANT })
    expect(actual).toEqual(expected)
  })

  it('should handle PeopleSelector/SET_AUTOCOMPLETE', () => {
    const state = {}
    const expected = { autocomplete: 'flargleargle' }
    const actual = reducer(state, { type: store.SET_AUTOCOMPLETE, payload: 'flargleargle' })
    expect(actual).toEqual(expected)
  })
})
