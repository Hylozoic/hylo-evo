import { FETCH_PERSON } from 'store/constants'
import PersonDetailsQuery from 'graphql/queries/PersonDetailsQuery'

export default function fetchPerson (id, query = PersonDetailsQuery) {
  return {
    type: FETCH_PERSON,
    graphql: {
      query,
      variables: { id }
    },
    meta: { extractModel: 'Person' }
  }
}
