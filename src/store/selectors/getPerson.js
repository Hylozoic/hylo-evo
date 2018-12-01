import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

const getPerson = ormCreateSelector(
  orm,
  state => state.orm,
  (state, { personId }) => personId,
  ({ Person }, personId) => Person.hasId(personId) ? Person.withId(personId) : null
)

export default getPerson
