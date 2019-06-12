import { createSelector as ormCreateSelector } from 'redux-orm'
import { matchPath } from 'react-router-dom'
import { flow, groupBy, map, pick, find, reduce, sortBy, values } from 'lodash/fp'
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

  const names = topics.map(topic => topic.name)

  topics = topics.filter((topic, index) => names.indexOf(topic.name) === index)

  return topics
}

export const getSubscribedCommunityTopics = ormCreateSelector(
  orm,
  state => state.orm,
  getCommunityForCurrentRoute,
  getNetworkForCurrentRoute,
  (session, community, network) => {
    let communityTopics

    if (community) {
      communityTopics = session.CommunityTopic
        .filter({ community: community.id, isSubscribed: true })
        .toModelArray()

      return sortBy(getTopicName, communityTopics)
    }

    if (network) {
      communityTopics = session.CommunityTopic.filter(
        communityTopic => {
          return communityTopic.community && find(
            cid => communityTopic.community === cid.toString(),
            network.communities.toModelArray().map(c => c.id)
          ) && communityTopic.isSubscribed
        }
      ).toModelArray()

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
