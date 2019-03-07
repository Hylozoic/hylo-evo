import { FETCH_PEOPLE } from 'store/constants'
import peopleQuery from 'graphql/queries/peopleQuery'

export default function fetchPeople (autocomplete, query = peopleQuery, first = 20) {
  return {
    type: FETCH_PEOPLE,
    graphql: {
      query,
      variables: { autocomplete, first }
    },
    meta: { extractModel: 'Person' }
  }
}
