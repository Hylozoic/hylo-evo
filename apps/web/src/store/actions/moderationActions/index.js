import { get } from 'lodash/fp'

import {
  CLEAR_MODERATION_ACTION,
  CREATE_MODERATION_ACTION,
  FETCH_MODERATION_ACTIONS,
  RECORD_CLICKTHROUGH
} from 'store/constants'

export function clearModerationAction ({ postId, moderationActionId, groupId }) {
  return {
    type: CLEAR_MODERATION_ACTION,
    graphql: {
      query: `mutation ( $postId: ID, $moderationActionId: ID, $groupId: ID ) {
        clearModerationAction ( postId: $postId, moderationActionId: $moderationActionId, groupId: $groupId ) {
          success
        }
      }`,
      variables: { postId, moderationActionId, groupId }
    },
    meta: {
      moderationActionId,
      groupId,
      postId,
      optimistic: true
    }
  }
}

export function createModerationAction (data) {
  return {
    type: CREATE_MODERATION_ACTION,
    graphql: {
      query: `mutation ($data: ModerationActionInput) {
        createModerationAction (data: $data) {
          id
          postId
          groupId
          text
          anonymous
          agreements {
            id
          }
          platformAgreements {
            id
          }
        }
      }`,
      variables: { data }
    },
    meta: {
      data,
      optimistic: true
    }
  }
}

export function recordClickthrough ({ postId }) {
  return {
    type: RECORD_CLICKTHROUGH,
    graphql: {
      query: `mutation ($postId: ID) {
        recordClickthrough (postId: $postId) {
          success
        }
      }`,
      variables: { postId }
    },
    meta: {
      postId,
      optimistic: true
    }
  }
}

export function fetchModerationActions ({ slug, offset, sortBy, first = 20 }) {
  return {
    type: FETCH_MODERATION_ACTIONS,
    graphql: {
      query: `query ($slug: String, $offset: Int, $sortBy: String, $first: Int) {
        moderationActions (slug: $slug, offset: $offset, sortBy: $sortBy, first: $first) {
          hasMore
          items {
            id
            postId
            groupId
            status
            post {
              id
              title
              details
              type
              creator {
                id
                name
                avatarUrl
              }
              groups { 
                id
              }
            }
            text
            reporter {
              id
              name
              avatarUrl
            }
            anonymous
            agreements {
              id
              description
              order
              title
            }
            platformAgreements {
              id
            }
          }
        }
      }`,
      variables: { slug, offset, sortBy, first }
    },
    meta: {
      slug,
      extractModel: 'ModerationAction',
      extractQueryResults: {
        getItems: get('payload.data.items.moderationActions')
      }
    }
  }
}
