import { createSelector as ormCreateSelector } from 'redux-orm'
import { matchPath } from 'react-router-dom'
import { flow, groupBy, map, omit, pick, reduce, sortBy, values } from 'lodash/fp'
import orm from 'store/models'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { topicUrl } from 'util/navigation'

const getTopicName = ({ topic: { name } }) => name.toLowerCase()

export const getTopicsFromSubscribedGroupTopics = (state, props) => {
  const { routeParams, location } = props
  const groupTopics = getSubscribedGroupTopics(state, props)

  let topics = groupTopics.map(groupTopic => {
    return {
      ...groupTopic.ref,
      ...groupTopic.topic.ref,
      url: topicUrl(groupTopic.topic.name, routeParams),
      current: matchPath(
        location.pathname,
        { path: topicUrl(groupTopic.topicName, routeParams) }
      )
    }
  })

  return topics
}

export const getSubscribedGroupTopics = ormCreateSelector(
  orm,
  getGroupForCurrentRoute,
  (session, group) => {
    let groupTopics

    if (group) {
      groupTopics = session.GroupTopic
        .filter({ group: group.id, isSubscribed: true, visibility: 1 })
        .toModelArray()
      const pinnedGroupTopics = session.GroupTopic
        .filter({ group: group.id, isSubscribed: true, visibility: 2 })
        .toModelArray()

      return sortBy(getTopicName, pinnedGroupTopics).concat(sortBy(getTopicName, groupTopics))
    }

    let allGroupTopics = session.GroupTopic
      .filter({ isSubscribed: true })
      .toModelArray()
      .map(ct => omit(['visibility'], { ...ct.ref, topic: ct.topic })) // remove visibility tracking at all topics level

    return sortBy(getTopicName, mergeGroupTopics(allGroupTopics))
  }
)

export const mergeGroupTopics = flow([
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
