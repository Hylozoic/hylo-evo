import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import { FETCH_GROUPS } from 'store/constants'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'
export const MODULE_NAME = 'FeedList'
export const STORE_FETCH_POSTS_PARAM = `${MODULE_NAME}/STORE_FETCH_POSTS_PARAM`

export function fetchGroups ({ offset, order, search, slug, sortBy, nearCoord, pageSize = 20 }) {
  const query = groupQuery
  const extractModel = 'Group'
  const getItems = get('payload.data.groups')

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
  $nearCoord: PointInput,
  $offset: Int,
  $order: String,
  $search: String,
  $sortBy: String
) {
  groups( 
    boundingBox: $boundingBox,
    first: $first,
    nearCoord: $nearCoord,
    offset: $offset,
    order: $order,
    search: $search,
    sortBy: $sortBy
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
}
`

const getGroupsResults = makeGetQueryResults(FETCH_GROUPS)

export const getHasMoreGroups = createSelector(getGroupsResults, get('hasMore'))

export const getGroups = makeQueryResultsModelSelector(
  getGroupsResults,
  'Group'
)
