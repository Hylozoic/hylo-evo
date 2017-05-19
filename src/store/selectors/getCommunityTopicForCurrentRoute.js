import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getParam from './getParam'

const getCommunityTopicForCurrentRoute = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => getParam('slug', state, props),
  (state, props) => getParam('topicName', state, props),
  (session, slug, topicName) => {
    try {
      const community = session.Community.get({slug})
      const topic = session.Topic.get({name: topicName})
      return topic.communityTopics.filter({community: community.id}).first()
    } catch (e) {
      return null
    }
  }
)

export default getCommunityTopicForCurrentRoute
