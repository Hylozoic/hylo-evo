import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'

export const getMe = ormCreateSelector(orm, session => {
  return session.Me.first()
})
