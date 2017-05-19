import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const getPerson = ormCreateSelector(
  orm,
  state => state.orm,
  (state, { personId }) => personId,
  ({ Person }, id) => Person.hasId(id) ? Person.withId(id) : null
)
