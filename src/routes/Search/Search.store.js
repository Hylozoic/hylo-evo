import { get } from 'lodash/fp'
import { getPostFieldsFragment } from 'store/actions/fetchPost'

export const MODULE_NAME = 'Search'

export const SET_SEARCH_TERM = `${MODULE_NAME}/SET_SEARCH_TERM`
export const SET_SEARCH_FILTER = `${MODULE_NAME}/SET_SEARCH_FILTER`
export const FETCH_SEARCH = `${MODULE_NAME}/FETCH_SEARCH`

const defaultState = {
  search: '',
  filter: 'all'
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_SEARCH_TERM:
      return {
        ...state,
        search: payload
      }
    case SET_SEARCH_FILTER:
      return {
        ...state,
        filter: payload
      }
    default:
      return state
  }
}

export function setSearchTerm (search) {
  return {
    type: SET_SEARCH_TERM,
    payload: search
  }
}

export function setSearchFilter (filter) {
  return {
    type: SET_SEARCH_FILTER,
    payload: filter
  }
}

export function getSearchTerm (state) {
  return state[MODULE_NAME].search
}

export function getSearchFilter (state) {
  return state[MODULE_NAME].filter
}

export function fetchSearchResults ({search, offset = 0, filter}) {
  return {
    type: FETCH_SEARCH,
    graphql: {
      query: `query ($search: String, $type: String, $offset: Int) {
        search(term: $search, first: 10, type: $type, offset: $offset) {
          total
          hasMore
          items {
            id
            content {
              __typename
              ... on Person {
                id
                name
                location
                avatarUrl
                skills {
                  items {
                    id
                    name
                  }
                }
              }
              ... on Post {
                ${getPostFieldsFragment(false)}
              }
              ... on Comment {
                id
                text
                createdAt
                creator {
                  id
                  name
                  avatarUrl
                }
                post {
                  id
                  title
                }
                attachments {
                  id
                  url
                  type
                }
              }
            }
          }
        }
      }`,
      variables: {
        search,
        offset,
        type: filter
      }
    },
    meta: {
      extractModel: 'SearchResult',
      extractQueryResults: {
        getItems: get('payload.data.search')
      }
    }
  }
}
