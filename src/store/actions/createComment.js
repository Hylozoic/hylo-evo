import { CREATE_COMMENT } from 'store/constants'
import { uniqueId } from 'lodash/fp'
import { AnalyticsEvents } from 'hylo-utils/constants'
import CreateCommentMutation from 'graphql/mutations/CreateCommentMutation.graphql'

export default function createComment ({
  postId,
  text,
  imageUrls = [],
  fileUrls = []
}) {
  return {
    type: CREATE_COMMENT,
    graphql: {
      query: CreateCommentMutation,
      variables: {
        postId,
        text,
        imageUrls,
        fileUrls
      }
    },
    meta: {
      optimistic: true,
      extractModel: 'Comment',
      tempId: uniqueId(`post${postId}_`),
      postId,
      text,
      analytics: AnalyticsEvents.COMMENT_CREATED
    }
  }
}
