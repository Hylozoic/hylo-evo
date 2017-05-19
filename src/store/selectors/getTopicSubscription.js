import orm from 'store/models'
import { get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getTopicSubscription = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => props.topicName,
  (state, props) => get('community.id', props),
  (session, topicName, communityId) => {
    try {
      const community = session.Community.withId(communityId)
      const topic = session.Topic.get({name: topicName})
      return community.topicSubscriptions.filter({topic: topic.id}).first()
    } catch (e) {
      return null
    }
  }
)

export default getTopicSubscription
