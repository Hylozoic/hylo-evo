import { LOCATION_CHANGE } from 'redux-first-history'
import { pick } from 'lodash/fp'
import rollbar from 'client/rollbar'
import {
  FETCH_FOR_CURRENT_USER,
  FETCH_FOR_GROUP_PENDING,
  LOGOUT_PENDING
} from 'store/constants'

export const MODULE_NAME = 'AuthLayoutRouter'

const TOGGLE_DRAWER = `${MODULE_NAME}/TOGGLE_DRAWER`

const TOGGLE_GROUP_MENU = `${MODULE_NAME}/TOGGLE_GROUP_MENU`

export const initialState = {
  isDrawerOpen: false,
  isGroupMenuOpen: false
}

export default function reducer (state = initialState, action) {
  if (action.error) return state

  if (action.type === TOGGLE_DRAWER) {
    return { ...state, isDrawerOpen: !state.isDrawerOpen }
  }

  if (action.type === TOGGLE_GROUP_MENU) {
    return { ...state, isGroupMenuOpen: !state.isGroupMenuOpen }
  }

  if (action.type === LOCATION_CHANGE) {
    return { ...state, isDrawerOpen: false, isGroupMenuOpen: false }
  }

  // Links current user to rollbar config
  if (action.type === FETCH_FOR_CURRENT_USER) {
    const { id, name, email } = action.payload.data.me
    rollbar.configure({
      payload: {
        person: {
          id,
          username: name,
          email
        }
      }
    })
  }

  return state
}

export function toggleDrawer () {
  return {
    type: TOGGLE_DRAWER
  }
}

export function toggleGroupMenu () {
  return {
    type: TOGGLE_GROUP_MENU
  }
}

export function ormSessionReducer (
  { Group, Me, Membership, Person },
  { type, meta, payload }
) {
  switch (type) {
    case LOGOUT_PENDING: {
      Me.first().delete()
      break
    }
    case FETCH_FOR_GROUP_PENDING: {
      const group = Group.safeGet({ slug: meta.slug })
      if (!group) return
      const me = Me.first()
      if (!me) return
      const membership = Membership.safeGet({ group: group.id, person: me.id })
      if (!membership) return
      return membership.update({ newPostCount: 0 })
    }
    case FETCH_FOR_CURRENT_USER: {
      const me = payload.data?.me
      if (me && !Person.idExists(me.id)) {
        Person.create(pick(['id', 'name', 'avatarUrl'], me))
      }
      break
    }
  }
}
