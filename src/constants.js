// These are used when creating posts and comments with mentions and topic tags
// in them. The reason TOPIC_ENTITY_TYPE is '#mention' as opposed to something
// more human-understandable has something to do with the Draft.js plugin used
// in hylo-evo. Ask Loren :)
export const MENTION_ENTITY_TYPE = 'mention'
export const TOPIC_ENTITY_TYPE = '#mention'

export const AnalyticsEvents  = {
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

export const HASHTAG_FULL_REGEX = /^#([A-Za-z][\w_-]+)$/
