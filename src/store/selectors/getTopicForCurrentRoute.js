import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getParam from './getParam'

const getTopicForCurrentRoute = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => getParam('topicName', state, props),
  (session, topicName) => session.Topic.safeGet({name: topicName})
)

export default getTopicForCurrentRoute
