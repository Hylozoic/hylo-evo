import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getCommonRoles = ormCreateSelector(
  orm,
  session => {
    return session.CommonRole.all().toRefArray()
  }
)

export default getCommonRoles
