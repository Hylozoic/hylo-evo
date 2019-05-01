import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
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

export const getHoloChatMatches = ormCreateSelector(
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

export const getRecentContacts = ormCreateSelector(
  orm,
  state => state.orm,
  state => state[MODULE_NAME].participants,
  personConnectionListItemSelector
)

export function participantsFromStore (state) {
  return state[MODULE_NAME].participants
}

export const getParticipants = createSelector(
  participantsFromStore,
  fromStore => fromStore.map(participant =>
    pick([ 'id', 'name', 'avatarUrl' ], participant))
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
  }

  return state
}
