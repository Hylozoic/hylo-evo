import { createSelector } from 'redux-orm'

import orm from 'store/models'

export const MODULE_NAME = 'PeopleSelectorMatches'

export const matchesSelector = createSelector(
  orm,
  state => state.orm,
  state => state.NewMessageThread,
  (session, thread) => {
    if (thread.autocomplete) {
      return session.Person
        .all()
        // TODO: hah! tidy this up
        .filter(p => p.name.toLowerCase().includes(thread.autocomplete.toLowerCase()))
        .toRefArray()
    }
    return null
  }
)
