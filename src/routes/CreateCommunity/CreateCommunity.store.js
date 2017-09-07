import { createSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = `CREATE_COMMUNITY`
export const ADD_COMMUNITY_NAME = `${MODULE_NAME}_ADD_COMMUNITY_NAME`

export default function reducer (state = {}, action) {
  if (action.type === ADD_COMMUNITY_NAME) {
    return {...state, name: action.payload.name}
  }
  return state
}

export const getCommunityName = createSelector(
  orm,
  state => state,
  ({state}) => {
    console.log('getCommunityName state.CreateCommunity', state.CreateCommunity)
    if (!state.CreateCommunity.name) return ''
    console.log('return', state.CreateCommunity.name)
    return state.CreateCommunity.name
  }
)
