import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getCommunityMembersCount = ormCreateSelector(
  orm,
  state => state.orm,
  session => {
    if (session.state.CommunityMembers.items) {
      return session.state.CommunityMembers.items.length
    }
    return 0
  }
)

export default getCommunityMembersCount
