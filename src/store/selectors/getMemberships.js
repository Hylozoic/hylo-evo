import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

const getMemberships = ormCreateSelector(
  orm,
  state => state.orm,
  session => {
    return session.Membership.all().toModelArray()
  }
)

export default getMemberships
