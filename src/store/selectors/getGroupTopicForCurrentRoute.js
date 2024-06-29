import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getRouteParam from './getRouteParam'

const getGroupTopicForCurrentRoute = ormCreateSelector(
  orm,
  (state, props) => getRouteParam('groupSlug', props),
  (state, props) => getRouteParam('topicName', props),
  (session, slug, topicName) => {
    const group = session.Group.get({ slug })
    const topic = session.Topic.get({ name: topicName })
    if (!group || !topic) return null
    return topic.groupTopics.filter({ group: group.id }).first()
  }
)

export default getGroupTopicForCurrentRoute
