import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { getOr, includes, isEmpty } from 'lodash/fp'
import { makeGetQueryResults } from 'store/reducers/queryResults'

export const FETCH_MEMBERS = 'FETCH_MEMBERS'

export function fetchMembers (slug, sortBy, offset) {
  return {
    type: FETCH_MEMBERS,
    graphql: {
      query: `query ($slug: String, $first: Int, $sortBy: String, $offset: Int) {
        community (slug: $slug) {
          id
          name
          avatarUrl
          memberCount
          members (first: $first, sortBy: $sortBy, offset: $offset) {
            total
            items {
              id
              name
              avatarUrl
              location
              tagline
            }
          }
        }
      }`,
      variables: {
        slug,
        first: 20,
        offset,
        sortBy
      }
    },
    meta: {
      rootModelName: 'Community'
    }
  }
}

export default function reducer (state = {}, action) {
  return state
}

export const getMembers = ormCreateSelector(
  orm,
  state => state.orm,
  makeGetQueryResults(FETCH_MEMBERS),
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.Person.all()
    .filter(x => includes(x.id, results.ids))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
  }
)

export const getMembersTotal = createSelector(
  makeGetQueryResults(FETCH_MEMBERS),
  getOr(0, 'total')
)
