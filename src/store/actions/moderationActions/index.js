import {
  CLEAR_MODERATION_ACTION,
  CREATE_MODERATION_ACTION,
  RECORD_CLICKTHROUGH
} from 'store/constants'

export function clearModerationACtion ({ optionId, postId, moderationActionId }) {
  return {
    type: CLEAR_MODERATION_ACTION,
    graphql: {
      query: `mutation ($optionId: ID, $postId: ID, $moderationActionId: ID) {
        clearModeationAction (optionId: $optionId, postId: $postId, moderationActionId: $moderationActionId) {
          success
        }
      }`,
      variables: { optionId, postId, moderationActionId }
    },
    meta: {
      moderationActionId,
      optionId,
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
