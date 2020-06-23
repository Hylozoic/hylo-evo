import { FETCH_PEOPLE } from 'store/constants'
import PeopleQuery from 'graphql/queries/PeopleQuery.graphql'

export default function fetchPeople (autocomplete, communityIds, query = PeopleQuery, first = 20) {
  return {
    type: FETCH_PEOPLE,
    graphql: {
      query,
      variables: { autocomplete, first, communityIds }
    },
    meta: {
      extractModel: 'Person'
    }
  }
}
