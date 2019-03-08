import { createSelector } from 'redux-orm'
import { pick } from 'lodash/fp'

import getMe from 'store/selectors/getMe'
import orm from 'store/models'
import {
  CREATE_MESSAGE,
  FIND_OR_CREATE_THREAD
} from 'store/constants'

export const MODULE_NAME = 'PeopleSelector'

export const FETCH_CONTACTS = 'FETCH_CONTACTS'
export const FETCH_RECENT_CONTACTS = 'FETCH_RECENT_CONTACTS'
export const SET_AUTOCOMPLETE = 'PeopleSelector/SET_AUTOCOMPLETE'
export const ADD_PARTICIPANT = 'PeopleSelector/ADD_PARTICIPANT'
export const REMOVE_PARTICIPANT = 'PeopleSelector/REMOVE_PARTICIPANT'

const findOrCreateThreadQuery =
`mutation ($participantIds: [String]) {
  findOrCreateThread(data: {participantIds: $participantIds}) {
    id
    createdAt
    updatedAt
    participants {
      id
      name
      avatarUrl
    }
  }
}`

export function findOrCreateThread (participantIds, query = findOrCreateThreadQuery) {
  const createdAt = new Date().getTime().toString()
  return {
    type: FIND_OR_CREATE_THREAD,
    graphql: {
      query,
      variables: {participantIds, createdAt}
    },
    meta: {
      holoChatAPI: true,
      extractModel: 'MessageThread'
    }
  }
}

const fetchContactsQuery =
`query PeopleContacts ($first: Int) {
  people (first: $first) {
    items {
      id
      name
      avatarUrl
      memberships (first: 1) {
        id
        community {
          id
          name
        }
      }
    }
  }
}`

export function fetchContacts (query = fetchContactsQuery, first = 50) {
  return {
    type: FETCH_CONTACTS,
    graphql: {
      query,
      variables: { first }
    },
    meta: {
      holoChatAPI: true,
      extractModel: 'Person'
    }
  }
}

const fetchRecentContactsQuery =
`query RecentPersonConnections ($first: Int) {
  connections (first: $first) {
    items {
      id
      person {
        id
        name
        avatarUrl
        memberships (first: 1) {
          id
          community {
            id
            name
          }
        }
      }
      type
      updatedAt
    }
  }
}`

export function fetchRecentContacts (query = fetchRecentContactsQuery, first = 20) {
  return {
    type: FETCH_RECENT_CONTACTS,
    graphql: {
      query,
      variables: { first }
    },
    meta: { extractModel: 'PersonConnection' }
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

export function pickPersonListItem (person) {
  return {
    ...pick([ 'id', 'name', 'avatarUrl' ], person.ref),
    community: person.memberships.first()
      ? person.memberships.first().community.name : null
  }
}

export function personListItemSelector (session, participants, currentUser, search = () => true) {
  return session.Person
    .all()
    .filter(p => !participants.includes(p.id))
    .filter(search)
    .filter(p => currentUser ? currentUser.id !== p.id : true)
    .orderBy('name')
    .toModelArray()
    .map(pickPersonListItem)
}

export const holoChatContactsSelector = createSelector(
  orm,
  state => state.orm,
  state => state[MODULE_NAME].participants,
  getMe,
  state => p => p.holoChatUser,
  personListItemSelector
)

export const holoChatMatchesSelector = createSelector(
  orm,
  state => state.orm,
  state => state[MODULE_NAME].participants,
  getMe,
  state => p => {
    const { autocomplete } = state[MODULE_NAME]
    if (autocomplete) {
      return p.holoChatUser && p.name.toLowerCase().includes(autocomplete.toLowerCase())
    }
  },
  personListItemSelector
)

const nameSort = (a, b) => {
  const aName = a.name.toUpperCase()
  const bName = b.name.toUpperCase()
  return aName > bName ? 1 : aName < bName ? -1 : 0
}

export function personConnectionListItemSelector (session, participants) {
  return session.PersonConnection
    .all()
    .toModelArray()
    .map(connection => pickPersonListItem(connection.person))
    .filter(person => !participants.includes(person.id))
    .sort(nameSort)
}

export const recentContactsSelector = createSelector(
  orm,
  state => state.orm,
  state => state[MODULE_NAME].participants,
  personConnectionListItemSelector
)

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

export const defaultState = {
  participants: []
}

export default function reducer (state = defaultState, action) {
  const { error, payload, type, meta } = action
  if (error) return state

  switch (type) {
    case CREATE_MESSAGE:
      if (meta.forNewThread) {
        return defaultState
      }
      break

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
