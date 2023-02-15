export const AnalyticsEvents = {
  BLOCK_USER: 'User Blocked',
  COMMENT_CREATED: 'Comment Created',
  COMMENT_REACTION: 'Reacted to Comment',
  DIRECT_MESSAGE_SENT: 'Direct Message Sent',
  EVENT_RSVP: 'Event RSVP',
  GROUP_CREATED: 'Group Created',
  GROUP_INVITATION_ACCEPTED: 'Group Invitation Accepted',
  POST_CREATED: 'Post Created',
  POST_OPENED: 'Post Opened',
  POST_REACTION: 'Reacted to Post',
  POST_SHARED: 'Post Shared',
  POST_UPDATED: 'Post Updated',
  SIGNUP_EMAIL_VERIFICATION_SENT: 'Email Verification Sent',
  SIGNUP_EMAIL_VERIFIED: 'Email Verified',
  SIGNUP_REGISTERED: 'Registered',
  SIGNUP_COMPLETE: 'Signup Complete',
  TOPIC_CREATED: 'Topic Created',
  VOTED_ON_POST: 'Voted on Post', // Remove once mobile has switched to POST_REACTION
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
    ON_UPDATE: 'ON_CHANGE',
    ON_ENTER: 'ON_ENTER',
    SET_PROPS: 'SET_PROPS'
  }
}

// https://regex101.com/r/0M6mbp/1
export const HYLO_URL_REGEX = /^(https?:\/?\/?)?(www\.|staging\.)?(hylo\.com|localhost)(:?\d{0,6})(.*)/gi

// When/if ReduxORM models become shared merge add these back into the Group model
export const ALL_GROUPS_CONTEXT_SLUG = 'all'
export const PUBLIC_CONTEXT_SLUG = 'public'
