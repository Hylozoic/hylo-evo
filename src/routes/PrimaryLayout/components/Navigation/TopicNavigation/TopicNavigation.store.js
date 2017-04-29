import { get } from 'lodash/fp'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'

// Constants
export const FETCH_COMMUNITY = 'FETCH_COMMUNITY'

// Action Creators
export function fetchCommunity (slug) {
  return {
    type: FETCH_COMMUNITY,
    graphql: {
      query: `query ($slug: String) {
        community (slug: $slug) {
          id
          topicSubscriptions(first: 20, offset: 0) {
            hasMore
            items {
              id
              newPostCount
              community {
                id
              }
              topic {
                id
                name
              }
            }
          }
        }
      }`,
      variables: {slug}
    },
    meta: {
      extractModel: 'Community'
    }
  }
}

// Selectors
export const getCommunityFromSlug = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => get('slug', props),
  (session, slug) => {
    try {
      return session.Community.get({slug})
    } catch (e) {
      return null
    }
  }
)

export const getTopicSubscriptions = createSelector(
  getCommunityFromSlug,
  community => community
    ? community.topicSubscriptions.toModelArray()
      .map(ts => ({
        badge: ts.newPostCount,
        name: ts.topic.name
      }))
    : []
)
