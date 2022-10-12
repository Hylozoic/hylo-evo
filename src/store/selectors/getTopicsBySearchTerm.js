import { includes } from 'lodash'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import presentTopic from 'store/presenters/presentTopic'

export const getTopicsBySearchTerm = ormCreateSelector(
  orm,
  (_, { searchTerm }) => searchTerm,
  (session, searchTerm) => {
    if (!searchTerm) return []

    // FIXME: if the user has been browsing multiple groups, this will
    // include results that don't belong to the current group
    return session.Topic.all()
      .filter(topic => {
        return includes(
          topic.name && topic.name.toLowerCase(),
          searchTerm.toLowerCase()
        )
      })
      .toModelArray().map(topic => presentTopic(topic, {}))
  }
)

export default getTopicsBySearchTerm
