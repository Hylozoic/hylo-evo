import { createSelector as ormCreateSelector } from 'redux-orm'
import { matchPath } from 'react-router-dom'
import { find, flow, groupBy, map, omit, pick, reduce, sortBy, sortedUniqBy, values } from 'lodash/fp'
import orm from 'store/models'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import { topicUrl } from 'util/navigation'

const getTopicName = ({ topic: { name } }) => name.toLowerCase()

export const getTopicsFromSubscribedCommunityTopics = (state, props) => {
  const { routeParams, location } = props
  const communityTopics = getSubscribedCommunityTopics(state, props)

  let topics = communityTopics.map(communityTopic => {
    return {
      ...communityTopic.ref,
      ...communityTopic.topic.ref,
      url: topicUrl(communityTopic.topic.name, routeParams),
      current: matchPath(
        location.pathname,
        { path: topicUrl(communityTopic.topicName, routeParams) }
      )
    }
  })

  return topics
}

export const getSubscribedCommunityTopics = ormCreateSelector(
  orm,
  getCommunityForCurrentRoute,
  getNetworkForCurrentRoute,
  (session, community, network) => {
    let communityTopics

    if (community) {
      communityTopics = session.CommunityTopic
        .filter({ community: community.id, isSubscribed: true, visibility: 1 })
        .toModelArray()
      const pinnedCommunityTopics = session.CommunityTopic
        .filter({ community: community.id, isSubscribed: true, visibility: 2 })
        .toModelArray()

      return sortBy(getTopicName, pinnedCommunityTopics).concat(sortBy(getTopicName, communityTopics))
    }

    if (network) {
      const networkCommunities = network.communities.toModelArray().map(c => c.id)
      communityTopics = session.CommunityTopic.filter(
        communityTopic => {
          return communityTopic.isSubscribed &&
            communityTopic.community &&
            find(
              cid => communityTopic.community === cid.toString(),
              networkCommunities
            )
        }
      )
        .toModelArray()
        .map(ct => omit(['visibility'], { ...ct.ref, topic: ct.topic })) // remove visibility tracking at network level

      return sortedUniqBy(getTopicName, sortBy(getTopicName, communityTopics))
    }

    let allCommunityTopics = session.CommunityTopic
      .filter({ isSubscribed: true })
      .toModelArray()
      .map(ct => omit(['visibility'], { ...ct.ref, topic: ct.topic })) // remove visibility tracking at all topics level

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
