import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getMe = ormCreateSelector(
  orm,
  session => {
    return session.CommonRole.all().toRefArray()
  }
)

export default getMe
