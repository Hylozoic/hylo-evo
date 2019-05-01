import { FETCH_PEOPLE } from 'store/constants'
import PeopleQuery from 'graphql/queries/PeopleQuery.graphql'

export default function fetchPeople (autocomplete, query = PeopleQuery, first = 20, holochainAPI = false) {
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
