import { FETCH_PERSON } from 'store/constants'
import fetchPersonQuery from 'graphql/queries/fetchPersonQuery'

export default function fetchPerson (id, query = fetchPersonQuery) {
  return {
    type: FETCH_PERSON,
    graphql: {
      query,
      variables: { id }
    },
    meta: { extractModel: 'Person' }
  }
}
