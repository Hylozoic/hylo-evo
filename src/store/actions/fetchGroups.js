import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import { FETCH_GROUPS } from 'store/constants'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'
export const MODULE_NAME = 'FeedList'
export const STORE_FETCH_POSTS_PARAM = `${MODULE_NAME}/STORE_FETCH_POSTS_PARAM`

export function fetchGroups ({ nearCoord, offset, order, pageSize = 20, search, slug, sortBy, groupType }) {
  var query, extractModel, getItems

  query = groupQuery
  extractModel = 'Group'
  getItems = get('payload.data.groups')

  return {
    type: FETCH_GROUPS,
    graphql: {
      query,
      variables: {
        first: pageSize,
        nearCoord,
        offset: offset,
        order,
        search,
        sortBy,
        groupType
      }
    },
    meta: {
      slug,
      extractModel,
      extractQueryResults: {
        getItems
      }
    }
  }
}

const groupQuery = `query (
  $boundingBox: [PointInput],
  $first: Int,
  $nearCoord: PointInput,
  $offset: Int,
  $order: String,
  $search: String,
  $sortBy: String,
  $groupType: String
) {
  groups( 
    boundingBox: $boundingBox,
    first: $first,
    nearCoord: $nearCoord,
    offset: $offset,
    order: $order,
    search: $search,
    sortBy: $sortBy,
    groupType: $groupType
  ) {
    hasMore
    total
    items {
      accessibility
      memberCount
      description
      location
      locationObject {
        city
        country
        fullText
        locality
        neighborhood
        region
      }
      id
      avatarUrl
      bannerUrl
      name
      type
      settings {
        allowGroupInvites
        askGroupToGroupJoinQuestions
        askJoinQuestions
        publicMemberDirectory
        showSuggestedSkills
      }
      slug
      groupTopics(first: 8) {
        items {
          id
          topic {
            id
            name
          }
          postsTotal
        }
      }
      members(first: 5, sortBy: "last_active_at", order: "desc") {
        items {
          id
          avatarUrl
          lastActiveAt
          name
        }
      }
    }
  }
}`

const getGroupsResults = makeGetQueryResults(FETCH_GROUPS)

export const getHasMoreGroups = createSelector(getGroupsResults, get('hasMore'))

export const getGroups = makeQueryResultsModelSelector(
  getGroupsResults,
  'Group'
)
