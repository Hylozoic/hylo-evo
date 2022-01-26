import gql from 'graphql-tag'
import { get } from 'lodash/fp'
import GroupTopicQuerySetFragment from 'graphql/GroupTopicQuerySetFragment'

export const FETCH_GROUP_TOPICS = 'FETCH_GROUP_TOPICS'

const GroupTopicsQuery = gql`
  query GroupTopicsQuery(
    $id: ID
    $first: Int
    $offset: Int
    $sortBy: String
    $order: String
    $subscribed: Boolean
    $autocomplete: String
  ) {
    group (id: $id) {
      id
      groupTopics(
        first: $first,
        offset: $offset,
        sortBy: $sortBy,
        order: $order,
        subscribed: $subscribed,
        autocomplete: $autocomplete
      ) {
        ...GroupTopicQuerySetFragment
      }
    }
  }
  ${GroupTopicQuerySetFragment}
`

const RootTopicsQuery = gql`
  query RootTopicsQuery(
    $first: Int
    $offset: Int
    $sortBy: String
    $order: String
    $subscribed: Boolean
    $autocomplete: String
  ) {
    groupTopics(
      first: $first,
      offset: $offset,
      sortBy: $sortBy,
      order: $order,
      subscribed: $subscribed,
      autocomplete: $autocomplete
    ) {
      ...GroupTopicQuerySetFragment
    }
  }
  ${GroupTopicQuerySetFragment}
`

export default function fetchGroupTopics (groupId, {
  subscribed = false, first = 20, offset = 0, sortBy, autocomplete = ''
}) {
  let query, extractModel, getItems
  if (groupId) {
    query = GroupTopicsQuery
    extractModel = 'Group'
    getItems = get('payload.data.group.groupTopics')
  } else {
    query = RootTopicsQuery
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
