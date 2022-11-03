import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import { FETCH_GROUPS } from 'store/constants'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'
export const MODULE_NAME = 'Stream'
export const STORE_FETCH_POSTS_PARAM = `${MODULE_NAME}/STORE_FETCH_POSTS_PARAM`

export function fetchGroups ({ farmQuery, groupType, nearCoord, offset, order, pageSize = 20, search, slug, sortBy }) {
  const query = groupQuery
  const extractModel = 'Group'
  const getItems = get('payload.data.groups')

  return {
    type: FETCH_GROUPS,
    graphql: {
      query,
      variables: {
        first: pageSize,
        farmQuery,
        groupType,
        nearCoord,
        offset: offset,
        order,
        search,
        sortBy
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

const groupQuery = `
query (
  $boundingBox: [PointInput],
  $first: Int,
  $farmQuery: JSON,
  $groupType: String,
  $nearCoord: PointInput,
  $offset: Int,
  $order: String,
  $search: String,
  $sortBy: String
) {
  groups( 
    boundingBox: $boundingBox,
    first: $first,
    farmQuery: $farmQuery
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
      geoShape
      location
      locationObject {
        center {
          lat
          lng
        }
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
        hideExtensionData
      }
      slug
      groupTopics(first: 8) {
        items {
          id
          lastReadPostId
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
}
`

const getGroupsResults = makeGetQueryResults(FETCH_GROUPS)

export const getHasMoreGroups = createSelector(getGroupsResults, get('hasMore'))

export const getGroups = makeQueryResultsModelSelector(
  getGroupsResults,
  'Group'
)
