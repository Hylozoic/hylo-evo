import { FETCH_PEOPLE } from 'store/constants'
import fetchPeopleQuery from 'graphql/queries/fetchPeopleQuery'

export default function fetchPeople (autocomplete, query = fetchPeopleQuery, first = 20, holoChatAPI = false) {
  return {
    type: FETCH_PEOPLE,
    graphql: {
      query,
      variables: { autocomplete, first }
    },
    meta: {
      holoChatAPI,
      extractModel: 'Person'
    }
  }
}

export function fetchPeopleHoloChat (autocomplete, query = fetchPeopleQuery, first = 20) {
  return fetchPeople(autocomplete, query, first, true)
}
