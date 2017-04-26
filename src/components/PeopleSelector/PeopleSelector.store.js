export const MODULE_NAME = 'PeopleSelector'

export const FETCH_PEOPLE = 'FETCH_PEOPLE'
export const PEOPLE_SELECTOR_SET_AUTOCOMPLETE = 'PEOPLE_SELECTOR_SET_AUTOCOMPLETE'

const fetchPeopleQuery =
`query PersonAutocomplete ($autocomplete: String, $first: Int) {
  people (autocomplete: $autocomplete, first: $first) {
    items {
      id
      name
      memberships {
        id
        community {
          id
          name
        }
      }
    }
  }
}`

export function fetchPeople (autocomplete, query = fetchPeopleQuery, first = 20) {
  return {
    type: FETCH_PEOPLE,
    graphql: {
      query,
      variables: { autocomplete, first }
    },
    meta: { extractModel: 'Person' }
  }
}

export function setAutocomplete (autocomplete) {
  return {
    type: PEOPLE_SELECTOR_SET_AUTOCOMPLETE,
    payload: autocomplete
  }
}
