import { createSelector } from 'redux-orm'

import orm from 'store/models'

export const matchesSelector = createSelector(
  orm,
  state => state.orm,
  state => state.NewMessageThread,
  (session, thread) => {
    if (thread.autocomplete) {
      const term = thread.autocomplete.toLowerCase()
      const matches = session.Person
        .all()
        .filter(p => p.name.toLowerCase().includes(term))
        .orderBy('name')
        .toRefArray()
      if (matches.length > 0) {
        matches[0].active = true
      }
      return matches
    }
    return null
  }
)
