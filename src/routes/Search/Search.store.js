import { postFieldsFragment } from 'store/actions/fetchPost'

export const MODULE_NAME = 'Search'

export const SET_SEARCH_TERM = `${MODULE_NAME}/SET_SEARCH_TERM`
export const SET_SEARCH_FILTER = `${MODULE_NAME}/SET_SEARCH_FILTER`
export const FETCH_SEARCH = `${MODULE_NAME}/FETCH_SEARCH`

const defaultState = {
  term: '',
  filter: 'all'
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_SEARCH_TERM:
      return {
        ...state,
        term: payload
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

export function setSearchTerm (term) {
  return {
    type: SET_SEARCH_TERM,
    payload: term
  }
}

export function setSearchFilter (filter) {
  return {
    type: SET_SEARCH_FILTER,
    payload: filter
  }
}

export function getSearchTerm (state) {
  return state[MODULE_NAME].term
}

export function getSearchFilter (state) {
  return state[MODULE_NAME].filter
}

export function fetchSearchResults ({term, offset = 0, filter}) {
  return {
    type: FETCH_SEARCH,
    graphql: {
      query: `query ($term: String, $type: String, $offset: Int) {
        search(term: $term, first: 10, type: $type, offset: $offset) {
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
              }
              ... on Post {
                ${postFieldsFragment}
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
              }
            }
          }
        }
      }`,
      variables: {
        term,
        offset,
        type: filter
      }
    },
    meta: {
      extractModel: 'SearchResult'
    }
  }
}
