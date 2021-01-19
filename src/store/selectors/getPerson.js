import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

const getPerson = ormCreateSelector(
  orm,
  (state, props) => props.personId,
  ({ Person }, personId) => Person.idExists(personId) ? Person.withId(personId) : null
)

export default getPerson
