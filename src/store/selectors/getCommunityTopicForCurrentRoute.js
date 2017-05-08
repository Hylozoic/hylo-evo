import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, pick } from 'lodash/fp'
import getParam from './getParam'

const getCommunityTopicForCurrentRoute = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => getParam('slug', state, props),
  (state, props) => getParam('topicName', state, props),
  (session, slug, topicName) => {
    try {
      const matches = session.CommunityTopic.all().toModelArray().filter(ct => {
        return get('community.slug', ct) === slug && get('topic.name', ct) === topicName
      }).map(ct => {
        return {
          ...pick(['postsTotal', 'followersTotal'], ct),
          topic: ct.topic.ref
        }
      })
      return matches.length ? matches[0] : null
    } catch (e) {
      return null
    }
  }
)

export default getCommunityTopicForCurrentRoute
