import { get } from 'lodash/fp'
import { FETCH_PEOPLE } from 'store/constants'
import PeopleQuery from 'graphql/queries/PeopleQuery.graphql'

export default function fetchPeople (autocomplete, groupIds, query = PeopleQuery, first = 20) {
  return {
    type: FETCH_PEOPLE,
    graphql: {
      query,
      variables: { autocomplete, first, groupIds }
    },
    meta: {
      extractModel: 'Group',
      extractQueryResults: {
        getItems: get('payload.data.group.members')
      }
    }
  }
}
