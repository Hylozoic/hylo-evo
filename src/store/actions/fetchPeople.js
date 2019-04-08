import { FETCH_PEOPLE } from 'store/constants'
import peopleQuery from 'graphql/queries/peopleQuery'

export default function fetchPeople (autocomplete, query = fetchPeopleQuery, first = 20, holochainAPI = false) {
  return {
    type: FETCH_PEOPLE,
    graphql: {
      query,
      variables: { autocomplete, first }
    },
    meta: {
      holochainAPI,
      extractModel: 'Person'
    }
  }
}
