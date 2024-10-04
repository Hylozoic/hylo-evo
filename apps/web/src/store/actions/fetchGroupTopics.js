import { get } from 'lodash/fp'
import groupTopicsQueryFragment from '@graphql/fragments/groupTopicsQueryFragment'

export const FETCH_GROUP_TOPICS = 'FETCH_GROUP_TOPICS'

const groupQuery = `
query (
  $id: ID,
  $first: Int,
  $offset: Int,
  $sortBy: String,
  $order: String,
  $subscribed: Boolean,
  $autocomplete: String
) {
  group (id: $id) {
    id
    ${groupTopicsQueryFragment}
  }
}
`

const rootQuery = `
query (
  $first: Int,
  $offset: Int,
  $sortBy: String,
  $order: String,
  $subscribed: Boolean,
  $autocomplete: String
) {
  ${groupTopicsQueryFragment}
}
`

export default function fetchGroupTopics (groupId, {
  subscribed = false, first = 20, offset = 0, sortBy, autocomplete = ''
}) {
  let query, extractModel, getItems
  if (groupId) {
    query = groupQuery
    extractModel = 'Group'
    getItems = get('payload.data.group.groupTopics')
  } else {
    query = rootQuery
    extractModel = 'GroupTopic'
    getItems = get('payload.data.groupTopics')
  }
  return {
    type: FETCH_GROUP_TOPICS,
    graphql: {
      query,
      variables: {
        id: groupId,
        first,
        offset,
        subscribed,
        autocomplete,
        sortBy,
        order: 'desc'
      }
    },
    meta: {
      extractModel,
      extractQueryResults: {
        getItems
      }
    }
  }
}
