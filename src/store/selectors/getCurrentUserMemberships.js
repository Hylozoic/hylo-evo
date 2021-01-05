import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

// this selector assumes that all Memberships belong to the currentUser
// using this instead of currentUser.memberships to avoid a memoization issue
// see https://github.com/tommikaikkonen/redux-orm/issues/117
export const getCurrentUserMemberships = ormCreateSelector(
  orm,
  state => state.orm,
  (session) =>
    session.Membership.all().toModelArray()
)

export default getCurrentUserMemberships
