import { get } from 'lodash/fp'
import { FETCH_FOR_CURRENT_USER } from 'store/constants'
import MeQuery from 'graphql/queries/MeQuery.graphql'

export default function fetchForCurrentUser () {
  return {
    type: FETCH_FOR_CURRENT_USER,
    graphql: {
      query: MeQuery
    },
    meta: {
      extractModel: [
        {
          getRoot: get('me'),
          modelName: 'Me',
          append: true
        }
      ]
    }
  }
}
