import { CREATE_COMMENT } from 'store/constants'
import { uniqueId } from 'lodash/fp'
import { AnalyticsEvents, TextHelpers } from 'hylo-shared'
import CreateCommentMutation from '@graphql/mutations/CreateCommentMutation.graphql'

export default function createComment ({
  attachments,
  groupIds,
  parentCommentId,
  post,
  text
}) {
  const postId = post.id
  return {
    type: CREATE_COMMENT,
    graphql: {
      query: CreateCommentMutation,
      variables: {
        postId,
        parentCommentId,
        text,
        attachments
      }
    },
    meta: {
      optimistic: true,
      extractModel: 'Comment',
      tempId: uniqueId(`post${postId}_`),
      postId,
      text,
      attachments,
      analytics: {
        eventName: AnalyticsEvents.COMMENT_CREATED,
        commentLength: TextHelpers.textLengthHTML(text),
        groupId: post.groups.map(g => g.id),
        hasAttachments: attachments && attachments.length > 0,
        parentCommentId,
        postId
      }
    }
  }
}
