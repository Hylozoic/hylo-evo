import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const getPerson = ormCreateSelector(
  orm,
  state => state.orm,
  (state, { personId }) => personId,
  (session, id) => {
    if (!session.Person.hasId(id)) return null
    const person = session.Person.withId(id)
    return person
  }
)
