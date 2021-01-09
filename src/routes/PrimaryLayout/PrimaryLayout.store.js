import { LOCATION_CHANGE } from 'connected-react-router'
import { pick } from 'lodash/fp'
import rollbar from 'client/rollbar'
import {
  FETCH_FOR_CURRENT_USER,
  FETCH_FOR_COMMUNITY_PENDING
} from 'store/constants'
import clearCacheFor from 'store/reducers/ormReducer/clearCacheFor'

export const MODULE_NAME = 'PrimaryLayout'

const TOGGLE_DRAWER = `${MODULE_NAME}/TOGGLE_DRAWER`

export const initialState = {
  isDrawerOpen: false
}

export default function reducer (state = initialState, action) {
  if (action.error) return state

  if (action.type === TOGGLE_DRAWER) {
    return { ...state, isDrawerOpen: !state.isDrawerOpen }
  }

  if (action.type === LOCATION_CHANGE) {
    return { ...state, isDrawerOpen: false }
  }

  // Links current user to rollbar config
  if (action.type === FETCH_FOR_CURRENT_USER) {
    let { id, name, email } = action.payload.data.me
    rollbar.configure({
      payload: {
        person: {
          id: id,
          username: name,
          email: email
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

export function ormSessionReducer (
  { Community, Membership, Network, Person },
  { type, meta, payload }
) {
  if (type === FETCH_FOR_COMMUNITY_PENDING) {
    let community = Community.safeGet({ slug: meta.slug })
    if (!community) return
    let membership = Membership.safeGet({ community: community.id })
    if (!membership) return
    membership.update({ newPostCount: 0 })
  }

  if (type === FETCH_FOR_CURRENT_USER) {
    const { me } = payload.data
    if (!Person.idExists(me.id)) {
      Person.create(pick(['id', 'name', 'avatarUrl'], me))
    }
    // Clear Network for selectors
    Network.all().toRefArray().forEach(n => clearCacheFor(Network, n.id))
  }
}
