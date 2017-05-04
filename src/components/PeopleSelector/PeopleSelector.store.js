import { createSelector } from 'redux-orm'
import { pick } from 'lodash/fp'

import orm from 'store/models'

export const MODULE_NAME = 'PeopleSelector'

export const FETCH_PEOPLE = 'FETCH_PEOPLE'
export const SET_AUTOCOMPLETE = 'PeopleSelector/SET_AUTOCOMPLETE'
export const ADD_PARTICIPANT = 'PeopleSelector/ADD_PARTICIPANT'
export const REMOVE_PARTICIPANT = 'PeopleSelector/REMOVE_PARTICIPANT'

const fetchPeopleQuery =
`query PersonAutocomplete ($autocomplete: String, $first: Int) {
  people (autocomplete: $autocomplete, first: $first) {
    items {
      id
      name
      avatarUrl
      memberships {
        id
        community {
          id
          name
        }
      }
    }
  }
}`

export function fetchPeople (autocomplete, query = fetchPeopleQuery, first = 20) {
  return {
    type: FETCH_PEOPLE,
    graphql: {
      query,
      variables: { autocomplete, first }
    },
    meta: { extractModel: 'Person' }
  }
}

export function addParticipant (id) {
  return {
    type: ADD_PARTICIPANT,
    payload: id
  }
}

export function removeParticipant (id) {
  return {
    type: REMOVE_PARTICIPANT,
    payload: id
  }
}

export function setAutocomplete (autocomplete) {
  return {
    type: SET_AUTOCOMPLETE,
    payload: autocomplete
  }
}

export function participantsFromStore (state) {
  return state[MODULE_NAME].participants
}

export const participantsSelector = createSelector(
  orm,
  state => state.orm,
  participantsFromStore,
  (session, fromStore) => fromStore.map(id =>
    pick([ 'id', 'name', 'avatarUrl' ], session.Person.withId(id).ref))
)

export const matchesSelector = createSelector(
  orm,
  state => state.orm,
  state => state[MODULE_NAME].autocomplete,
  state => state[MODULE_NAME].participants,
  (session, autocomplete, participants) => {
    if (autocomplete) {
      const term = autocomplete.toLowerCase()
      const matches = session.Person
        .all()
        .filter(p => !participants.includes(p.id))
        .filter(p => p.name.toLowerCase().includes(term))
        .orderBy('name')
      return matches.toModelArray().map(match => ({
        ...pick([ 'id', 'name', 'avatarUrl' ], match.ref),
        community: match.memberships.first()
          ? match.memberships.first().community.name : null
      }))
    }
    return null
  }
)

export const defaultState = {
  participants: []
}

export default function reducer (state = defaultState, action) {
  const { error, payload, type } = action
  if (error) return state

  switch (type) {
    case SET_AUTOCOMPLETE:
      return {
        ...state,
        autocomplete: payload
      }

    case ADD_PARTICIPANT:
      return {
        ...state,
        participants: [ ...state.participants, payload ]
      }

    case REMOVE_PARTICIPANT:
      if (payload) {
        return {
          ...state,
          participants: state.participants.filter(p => p !== payload)
        }
      }
      // No payload? Remove the last element.
      return {
        ...state,
        participants: state.participants.slice(0, state.participants.length - 1)
      }
  }

  return state
}
