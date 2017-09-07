import { ADD_COMMUNITY_NAME } from '../CreateCommunity.store'

export function addName (name) {
  return {
    type: ADD_COMMUNITY_NAME,
    payload: {
      name
    }
  }
}
