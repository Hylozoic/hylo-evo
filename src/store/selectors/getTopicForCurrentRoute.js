import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getRouteParam from './getRouteParam'
import presentTopic from 'store/presenters/presentTopic'

const getTopicForCurrentRoute = ormCreateSelector(
  orm,
  (state, props) => getRouteParam('topicName', props),
  (session, topicName) => {
    const topic = session.Topic.safeGet({ name: topicName })
    return topic ? presentTopic(topic, {}) : null
  }
)

export default getTopicForCurrentRoute
