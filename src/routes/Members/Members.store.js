import { createSelector } from 'reselect'
import orm from 'store/models'
import { includes } from 'lodash/fp'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'

export const FETCH_MEMBERS = 'FETCH_MEMBERS'

export function fetchMembers (slug, order, afterId) {
  return {
    type: FETCH_MEMBERS,
    graphql: {
      query: `query ($slug: String, $first: Int, $cursor: ID, $order: String) {
        community (slug: $slug) {
          id
          name
          avatarUrl
          members (first: $first, cursor: $cursor, order: $order) {
            id
            name
            avatarUrl
            location
            tagline
          }
        }
      }`,
      variables: {
        slug,
        first: 20,
        cursor: afterId,
        order
      }
    },
    meta: {
      rootModelName: 'Community'
    }
  }
}

export const getMembers = createSelector(
  state => orm.session(state.orm),
  getCommunityForCurrentRoute,
  (session, community) => {
    return session.Person.all()
    .filter(x => includes(x.id, community.membersOrder))
    .orderBy(x => community.membersOrder.indexOf(x.id))
    .toModelArray()
  }
)
