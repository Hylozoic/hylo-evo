import { createSelector } from 'redux-orm'

import orm from 'store/models'

export const matchesSelector = createSelector(
  orm,
  state => state.orm,
  state => state.NewMessageThread,
  (session, thread) => {
    if (thread.autocomplete) {
      const term = thread.autocomplete.toLowerCase()
      return session.Person
        .all()
        .filter(p => p.name.toLowerCase().includes(term))
        .toRefArray()
    }
    return null
  }
)
