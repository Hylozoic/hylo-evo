export const MODULE_NAME = 'Search'

export const SET_SEARCH_TERM = `${MODULE_NAME}/SET_SEARCH`
export const FETCH_SEARCH = `${MODULE_NAME}/FETCH_SEARCH`

const defaultState = {
  search: ''
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

export function getSearchTerm (state) {
  return state[MODULE_NAME].term
}

export function fetchSearchResults (term, offset = 0) {
  return {
    type: FETCH_SEARCH,
    graphql: {
      query: `query ($term: String, $offset: Int) {
        search(term: $term, first: 10, offset: $offset) {
          total
          hasMore
          items {
            id
            content {
              __typename
              ... on Person {
                id
                name
                tagline
              }
              ... on Post {
                id
                title
                type
              }
              ... on Comment {
                id
                text
                creator {
                  name
                }
              }
            }
          }
        }
      }`,
      variables: {
        term,
        offset
      }
    },
    meta: {
      extractModel: 'SearchResult'
    }
  }
}
