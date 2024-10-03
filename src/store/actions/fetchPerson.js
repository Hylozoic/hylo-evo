import { FETCH_PERSON } from 'store/constants'
import personQuery from '@graphql/queries/personQuery'

export default function fetchPerson (id, query = personQuery) {
  return {
    type: FETCH_PERSON,
    graphql: {
      query,
      variables: { id }
    },
    meta: { extractModel: 'Person' }
  }
}
