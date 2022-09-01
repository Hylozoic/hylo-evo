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
    CLEAR_CONTENT: 'CLEAR_CONTENT',
    LOADED: 'LOADED',
    ON_ADD_LINK: 'ON_ADD_LINK',
    ON_ADD_TOPIC: 'ON_ADD_TOPIC',
    ON_CHANGE: 'ON_CHANGE',
    ON_ENTER: 'ON_ENTER',
    SET_PROPS: 'SET_PROPS'
  }
}

export const HASHTAG_FULL_REGEX = /^#([A-Za-z][\w_-]+)$/

// These are used when creating posts and comments with mentions and topic tags
// in them. The reason TOPIC_ENTITY_TYPE is '#mention' as opposed to something
// more human-understandable has to do with the limitations of the Draft.js plugin used
// in hylo-evo.
export const MENTION_ENTITY_TYPE = 'mention'
export const TOPIC_ENTITY_TYPE = '#mention'

// When/if ReduxORM models become shared merge add these back into the Group model
export const ALL_GROUPS_CONTEXT_SLUG = 'all'
export const PUBLIC_CONTEXT_SLUG = 'public'
