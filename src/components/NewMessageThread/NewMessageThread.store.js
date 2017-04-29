export const MODULE_NAME = 'NewMessageThread'
import { createSelector } from 'redux-orm'
import { pick } from 'lodash/fp'

import orm from 'store/models'
import {
  PEOPLE_SELECTOR_DELETE_MATCH,
  PEOPLE_SELECTOR_SET_AUTOCOMPLETE
} from 'components/PeopleSelector/PeopleSelector.store'

export const participantsSelector = createSelector(
  orm,
  state => state.orm,
  ({ NewMessageThread }) => NewMessageThread.participants,
  (session, participants) => participants.map(id => pick(
    [ 'id', 'name', 'avatarUrl' ],
    session.Person.withId(id).ref
  ))
)

const defaultState = {
  participants: []
}

export default function reducer (state = defaultState, action) {
  const { error, payload, type } = action
  if (error) return state

  switch (type) {
    case PEOPLE_SELECTOR_SET_AUTOCOMPLETE:
      return { ...state, autocomplete: payload }

    case PEOPLE_SELECTOR_DELETE_MATCH:
      return {
        ...state,
        participants: state.participants.filter(p => p !== payload)
      }

    default:
      return state
  }
}
