import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import { get, includes, isEmpty } from 'lodash/fp'
import orm from 'store/models'
import presentTopic from 'store/presenters/presentTopic'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import { FETCH_DEFAULT_TOPICS, FETCH_TOPICS, UPDATE_COMMUNITY_TOPIC } from 'store/constants'

export const MODULE_NAME = 'TopicsSettings'
export const SET_SORT = `${MODULE_NAME}/SET_SORT`
export const SET_SEARCH = `${MODULE_NAME}/SET_SEARCH`

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

export function setCommunityTopicVisibility (communityTopicId, visibility) {
  visibility = parseInt(visibility)
  return {
    type: UPDATE_COMMUNITY_TOPIC,
    graphql: {
      query: `mutation ($id: ID, $visibility: Int) {
        updateCommunityTopic(id: $id, data: { visibility: $visibility }) {
          success
        }
      }`,
      variables: {
        id: communityTopicId,
        visibility
      }
    },
    meta: {
      id: communityTopicId,
      data: {
        visibility
      },
      optimistic: true
    }
  }
}

export function setCommunityTopicIsDefault (communityTopicId, isDefault) {
  return {
    type: UPDATE_COMMUNITY_TOPIC,
    graphql: {
      query: `mutation ($id: ID, $isDefault: Boolean) {
        updateCommunityTopic(id: $id, data: { isDefault: $isDefault }) {
          success
        }
      }`,
      variables: {
        id: communityTopicId,
        isDefault
      }
    },
    meta: {
      id: communityTopicId,
      data: {
        isDefault
      },
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
  const { error, payload, type } = action
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

const getDefaultTopicsForCurrentUserResults = makeGetQueryResults(FETCH_DEFAULT_TOPICS)

export const getDefaultTopics = ormCreateSelector(
  orm,
  getDefaultTopicsForCurrentUserResults,
  (_, props) => props,
  (session, results, props) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    const topics = session.Topic.all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(x => results.ids.indexOf(x.id))
      .toModelArray()
      .map(topic => presentTopic(topic, props))

    return topics.filter(topic => {
      const communityTopic = topic.communityTopics.find(ct => ct.community.id === props.community.id)
      return communityTopic && communityTopic.isDefault
    })
  }
)

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
