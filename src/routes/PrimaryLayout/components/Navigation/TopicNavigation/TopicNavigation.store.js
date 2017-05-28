import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { sortBy } from 'lodash'

export const getSubscribedCommunityTopics = ormCreateSelector(
  orm,
  state => state.orm,
  getCommunityForCurrentRoute,
  (session, community) => {
    if (!community) return null
    const ct = session.CommunityTopic
    .filter({community: community.id, isSubscribed: true})
    .toModelArray()

    return sortBy(ct, ({ topic: { name } }) => name.toLowerCase())
  }
)
