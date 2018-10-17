import { createSelector } from 'redux-orm'
import { pick } from 'lodash/fp'

import getMe from 'store/selectors/getMe'
import orm from 'store/models'

export const MODULE_NAME = 'MemberSelector'

export const FETCH_CONTACTS = 'FETCH_CONTACTS'
export const FETCH_RECENT_CONTACTS = 'FETCH_RECENT_CONTACTS'
export const SET_AUTOCOMPLETE = `${MODULE_NAME}/SET_AUTOCOMPLETE`
export const ADD_MEMBER = `${MODULE_NAME}/ADD_MEMBER`
export const REMOVE_MEMBER = `${MODULE_NAME}/REMOVE_MEMBER`

export function addMember (id) {
  return {
    type: ADD_MEMBER,
    payload: id
  }
}

export function removeMember (id) {
  return {
    type: REMOVE_MEMBER,
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

export function personListItemSelector (session, members, currentUser, search = () => true) {
  return session.Person
    .all()
    .filter(p => !members.includes(p.id))
    .filter(search)
    .filter(p => currentUser ? currentUser.id !== p.id : true)
    .orderBy('name')
    .toModelArray()
    .map(pickPersonListItem)
}

export const getAutocomplete = (state, _) => state[MODULE_NAME].autocomplete

export const matchesSelector = createSelector(
  orm,
  state => state.orm,
  state => state[MODULE_NAME].members,
  getMe,
  state => p => {
    const { autocomplete } = state[MODULE_NAME]
    if (autocomplete) {
      return p.name.toLowerCase().includes(autocomplete.toLowerCase())
    }
  },
  personListItemSelector
)

export const defaultState = {
  autocomplete: '',
  members: []
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

    case ADD_MEMBER:
      return {
        ...state,
        members: [ ...state.members, payload ]
      }

    case REMOVE_MEMBER:
      if (payload) {
        return {
          ...state,
          members: state.members.filter(p => p !== payload)
        }
      }
  }

  return state
}