import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const getPerson = ormCreateSelector(
  orm,
  state => state.orm,
  (state, { match: { id } }) => id,
  (session, id) => {
    const person = session.Person.withId(id)
    return person
  }
)
