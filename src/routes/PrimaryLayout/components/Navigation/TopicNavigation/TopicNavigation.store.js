import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { sortBy } from 'lodash'

export const getSubscribedCommunityTopics = ormCreateSelector(
  orm,
  state => state.orm,
  getCommunityForCurrentRoute,
  (session, community) => {
    const ct = community.communityTopics
    .filter({isSubscribed: true})
    .toModelArray()

    return sortBy(ct, ({ topic: { name } }) => name.toLowerCase())
  }
)
