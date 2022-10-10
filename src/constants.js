export const AnalyticsEvents = {
  COMMENT_CREATED: 'Comment Created',
  GROUP_CREATED: 'Group Created',
  GROUP_INVITATION_ACCEPTED: 'Group Invitation Accepted',
  DIRECT_MESSAGE_SENT: 'Direct Message Sent',
  POST_CREATED: 'Post Created',
  POST_UPDATED: 'Post Updated',
  TOPIC_CREATED: 'Topic Created',
  VOTED_ON_POST: 'Voted on Post',
  BLOCK_USER: 'User Blocked',
  UNBLOCK_USER: 'User Un-Blocked'
}

export const WebViewMessageTypes = {
  JOINED_GROUP: 'JOINED_GROUP',
  LEFT_GROUP: 'LEFT_GROUP',
  NAVIGATION: 'NAVIGATION',
  EDITOR: {
    BLUR: 'BLUR',
    CLEAR_CONTENT: 'CLEAR_CONTENT',
    FOCUS: 'FOCUS',
    LOADED: 'LOADED',
    ON_ADD_LINK: 'ON_ADD_LINK',
    ON_ADD_TOPIC: 'ON_ADD_TOPIC',
    ON_CHANGE: 'ON_CHANGE',
    ON_ENTER: 'ON_ENTER',
    SET_PROPS: 'SET_PROPS'
  }
}

// https://regex101.com/r/0M6mbp/1
export const HYLO_URL_REGEX = /^(https?:\/?\/?)?(www\.|staging\.)?(hylo\.com|localhost)(:?\d{0,6})(.*)/gi

// When/if ReduxORM models become shared merge add these back into the Group model
export const ALL_GROUPS_CONTEXT_SLUG = 'all'
export const PUBLIC_CONTEXT_SLUG = 'public'
