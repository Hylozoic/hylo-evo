import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

const getMyMemberships = ormCreateSelector(
  orm,
  ({ Me, Membership }) => {
    const me = Me.first()
    if (!me) return []
    return Membership.filter({ person: me.id }).toModelArray()
  }
)

export default getMyMemberships
