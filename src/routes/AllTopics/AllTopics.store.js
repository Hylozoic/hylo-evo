export const MODULE_NAME = 'AllTopics'

export const SET_SORT = `${MODULE_NAME}/SET_SORT`
export const SET_SEARCH = `${MODULE_NAME}/SET_SEARCH`
export const DELETE_COMMUNITY_TOPIC = `${MODULE_NAME}/DELETE_COMMUNITY_TOPIC`
export const DELETE_COMMUNITY_TOPIC_PENDING = `${DELETE_COMMUNITY_TOPIC}_PENDING`

const defaultState = {
  sort: 'updated_at',
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

export function getSort (state) {
  return state[MODULE_NAME].sort
}

export function getSearch (state) {
  return state[MODULE_NAME].search
}

export function deleteCommunityTopic (communityTopicId) {
  return {
    type: DELETE_COMMUNITY_TOPIC,
    graphql: {
      query: `mutation ($id: ID) {
        deleteCommunityTopic(id: $id) {
          success
        }
      }`,
      variables: {
        id: communityTopicId
      }
    },
    meta: {
      id: communityTopicId,
      optimistic: true
    }
  }
}
