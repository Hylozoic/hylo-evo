import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { flow, groupBy, map, pick, reduce, sortBy, values } from 'lodash/fp'

const getTopicName = ({ topic: { name } }) => name.toLowerCase()

export const getSubscribedCommunityTopics = ormCreateSelector(
  orm,
  state => state.orm,
  getCommunityForCurrentRoute,
  (session, community) => {
    if (community) {
      let communityTopics = session.CommunityTopic
        .filter({ community: community.id, isSubscribed: true })
        .toModelArray()

      return sortBy(getTopicName, communityTopics)
    }

    let allCommunityTopics = session.CommunityTopic
      .filter({ isSubscribed: true })
      .toModelArray()

    return sortBy(getTopicName, mergeCommunityTopics(allCommunityTopics))
  }
)

export const mergeCommunityTopics = flow([
  groupBy(getTopicName),
  values,
  map(reduce((acc, ct) => {
    if (!acc) {
      return pick(['newPostCount', 'postsTotal', 'followersTotal', 'topic'], ct)
    }

    ;['newPostCount', 'postsTotal', 'followersTotal'].forEach(attr => {
      acc[attr] += ct[attr] || 0
    })

    return acc
  }, null))
])
