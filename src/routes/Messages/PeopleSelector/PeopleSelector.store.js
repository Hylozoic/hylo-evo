import { createSelector } from 'redux-orm'
import { pick } from 'lodash/fp'
import gql from 'graphql-tag'

import getMe from 'store/selectors/getMe'
import orm from 'store/models'
import { CREATE_MESSAGE } from 'store/constants'

export const MODULE_NAME = 'PeopleSelector'

export const FETCH_CONTACTS = 'FETCH_CONTACTS'
export const FETCH_RECENT_CONTACTS = 'FETCH_RECENT_CONTACTS'
export const SET_AUTOCOMPLETE = 'PeopleSelector/SET_AUTOCOMPLETE'
export const ADD_PARTICIPANT = 'PeopleSelector/ADD_PARTICIPANT'
export const REMOVE_PARTICIPANT = 'PeopleSelector/REMOVE_PARTICIPANT'

export const HolochainPeopleQuery = gql`
  query HolochainPeopleQuery ($first: Int) {
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
  }
`

export const RecentContactsQuery = gql`
  query RecentPersonConnections ($first: Int) {
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
  }
`

export function fetchRecentContacts (query = RecentContactsQuery, first = 20) {
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

export function getPersonListItem (session, participants, currentUser, search = () => true) {
  return session.Person
    .all()
    .filter(p => !participants.includes(p.id))
    .filter(search)
    .filter(p => currentUser ? currentUser.id !== p.id : true)
    .orderBy('name')
    .toModelArray()
    .map(pickPersonListItem)
}

export const getHoloChatMatches = createSelector(
  orm,
  state => state.orm,
  state => state[MODULE_NAME].participants,
  getMe,
  (state, props) => p => {
    const { autocomplete } = state[MODULE_NAME]
    if (autocomplete) {
      const holoFilter = props.holochainActive ? p.isHoloData : true
      return holoFilter && p.name.toLowerCase().includes(autocomplete.toLowerCase())
    }
  },
  getPersonListItem
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

export const getRecentContacts = createSelector(
  orm,
  state => state.orm,
  state => state[MODULE_NAME].participants,
  personConnectionListItemSelector
)

export function participantsFromStore (state) {
  return state[MODULE_NAME].participants
}

export const getParticipants = createSelector(
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
