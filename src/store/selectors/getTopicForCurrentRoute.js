import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getRouteParam from './getRouteParam'

const getTopicForCurrentRoute = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => getRouteParam('topicName', state, props),
  (session, topicName) => session.Topic.safeGet({name: topicName})
)

export default getTopicForCurrentRoute
