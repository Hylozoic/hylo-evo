import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getMe = ormCreateSelector(
  orm,
  state => state.orm,
  session => {
    return session.Me.first()
  }
)

export default getMe
