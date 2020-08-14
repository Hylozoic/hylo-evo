import { CREATE_COMMENT } from 'store/constants'
import { uniqueId } from 'lodash/fp'
import { AnalyticsEvents } from 'hylo-utils/constants'
import CreateCommentMutation from 'graphql/mutations/CreateCommentMutation.graphql'

export default function createComment ({
  postId,
  text,
  attachments
}) {
  return {
    type: CREATE_COMMENT,
    graphql: {
      query: CreateCommentMutation,
      variables: {
        postId,
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
      analytics: AnalyticsEvents.COMMENT_CREATED
    }
  }
}
