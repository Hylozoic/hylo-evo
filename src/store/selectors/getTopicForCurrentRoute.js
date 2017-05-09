import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import getParam from './getParam'

const getTopicForCurrentRoute = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => getParam('topicName', state, props),
  (session, topicName) => {
    try {
      const matches = session.Topic.all().toModelArray().filter(t => topicName === t.name)
      return matches.length ? matches[0] : null
    } catch (e) {
      return null
    }
  }
)

export default getTopicForCurrentRoute
