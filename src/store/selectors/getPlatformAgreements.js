import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getPlatformAgreements = ormCreateSelector(
  orm,
  session => {
    return session.PlatformAgreement.all().toRefArray()
  }
)

export default getPlatformAgreements
