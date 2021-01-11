import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getRouteParam from './getRouteParam'

const getCommunityTopicForCurrentRoute = ormCreateSelector(
  orm,
  (state, props) => getRouteParam('slug', state, props),
  (state, props) => getRouteParam('topicName', state, props),
  (session, slug, topicName) => {
    const community = session.Community.get({ slug })
    const topic = session.Topic.get({ name: topicName })
    if (!community || !topic) return null
    return topic.communityTopics.filter({ community: community.id }).first()
  }
)

export default getCommunityTopicForCurrentRoute
