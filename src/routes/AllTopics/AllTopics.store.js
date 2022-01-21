import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import { get, includes, isEmpty } from 'lodash/fp'
import presentTopic from 'store/presenters/presentTopic'
import orm from 'store/models'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import { FETCH_TOPICS } from 'store/constants'
import gql from 'graphql-tag'

export const MODULE_NAME = 'AllTopics'
export const SET_SORT = `${MODULE_NAME}/SET_SORT`
export const SET_SEARCH = `${MODULE_NAME}/SET_SEARCH`
export const DELETE_GROUP_TOPIC = `${MODULE_NAME}/DELETE_GROUP_TOPIC`
export const DELETE_GROUP_TOPIC_PENDING = `${DELETE_GROUP_TOPIC}_PENDING`

// Actions

export function setSort (sort) {
  return {
    type: SET_SORT,
    payload: sort
  }
}

export function setSearch (search) {
  return {
    type: SET_SEARCH,
    payload: search
  }
}

export function deleteGroupTopic (groupTopicId) {
  return {
    type: DELETE_GROUP_TOPIC,
    graphql: {
      query: gql`
        mutation ($id: ID) {
          deleteGroupTopic(id: $id) {
            success
          }
        }
      `,
      variables: {
        id: groupTopicId
      }
    },
    meta: {
      id: groupTopicId,
      optimistic: true
    }
  }
}

// Reducer

const defaultState = {
  sort: 'name',
  search: ''
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_SEARCH:
      return {
        ...state,
        search: payload
      }
    case SET_SORT:
      return {
        ...state,
        sort: payload
      }
    default:
      return state
  }
}

// Selectors

const getTopicsForCurrentUserResults = makeGetQueryResults(FETCH_TOPICS)

export const getTopics = ormCreateSelector(
  orm,
  getTopicsForCurrentUserResults,
  (_, props) => props,
  (session, results, props) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    const topics = session.Topic.all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(x => results.ids.indexOf(x.id))
      .toModelArray()

    return topics.map(topic => presentTopic(topic, props))
  }
)

export const getTotalTopics = createSelector(getTopicsForCurrentUserResults, get('total'))

export const getHasMoreTopics = createSelector(getTopicsForCurrentUserResults, get('hasMore'))

export function getSort (state) {
  return state[MODULE_NAME].sort
}

export function getSearch (state) {
  return state[MODULE_NAME].search
}
