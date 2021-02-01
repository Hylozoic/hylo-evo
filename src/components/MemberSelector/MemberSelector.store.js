import { createSelector } from 'redux-orm'
import { pick, uniqBy, orderBy, flow, reject, filter, map, reduce } from 'lodash/fp'

import getMe from 'store/selectors/getMe'
import orm from 'store/models'

export const MODULE_NAME = 'MemberSelector'

export const FETCH_CONTACTS = 'FETCH_CONTACTS'
export const FETCH_RECENT_CONTACTS = 'FETCH_RECENT_CONTACTS'
export const SET_AUTOCOMPLETE = `${MODULE_NAME}/SET_AUTOCOMPLETE`
export const ADD_MEMBER = `${MODULE_NAME}/ADD_MEMBER`
export const REMOVE_MEMBER = `${MODULE_NAME}/REMOVE_MEMBER`
export const SET_MEMBERS = `${MODULE_NAME}/SET_MEMBERS`

export function addMember (member) {
  return {
    type: ADD_MEMBER,
    payload: member
  }
}

export function removeMember (member) {
  return {
    type: REMOVE_MEMBER,
    payload: member
  }
}

export function setMembers (members) {
  return {
    type: SET_MEMBERS,
    payload: members
  }
}

export function setAutocomplete (autocomplete) {
  return {
    type: SET_AUTOCOMPLETE,
    payload: autocomplete
  }
}

export const getAutocomplete = (state, _) => state[MODULE_NAME].autocomplete

export const getMembers = (state, _) => state[MODULE_NAME].members

export const getMemberMatches = createSelector(
  orm,
  getMembers,
  getMe,
  (_, props) => props.forCommunities,
  getAutocomplete,
  (
    { Community },
    members,
    currentUser,
    forCommunities,
    autocomplete
  ) => {
    const forCommunityIds = forCommunities && forCommunities.map(c => c.id)
    const communities = Community
      .filter(c => forCommunityIds ? forCommunityIds.includes(c.id) : true)
      .toModelArray()
    const memberIds = members.map(m => m.id)
    const autocompleteFilter = p =>
      autocomplete && p.name.toLowerCase().includes(autocomplete.toLowerCase())
    const processors = [
      reduce((result, c) => result.concat(c.members.toModelArray()), []),
      uniqBy('id'),
      reject(p => memberIds.includes(p.id)),
      reject(p => currentUser ? currentUser.id === p.id : false),
      filter(autocompleteFilter),
      map(pick([ 'id', 'name', 'avatarUrl' ])),
      orderBy('name', 'asc')
    ]

    return flow(processors)(communities)
  }
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
          members: state.members.filter(p => p.id !== payload.id)
        }
      }
      break

    case SET_MEMBERS:
      return {
        ...state,
        members: payload
      }
  }

  return state
}
