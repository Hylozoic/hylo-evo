import { get } from 'lodash/fp'
import { textLength } from 'hylo-utils/text'
import { AnalyticsEvents } from 'hylo-utils/constants'
import { getPostFieldsFragment } from 'store/actions/fetchPost'
import { UPDATE_POST } from 'store/constants'

export default function updatePost (post) {
  const {
    id, type, title, details, communities, linkPreview, imageUrls, fileUrls, topicNames, memberIds
  } = post
  const linkPreviewId = linkPreview && linkPreview.id
  const communityIds = communities.map(c => c.id)

  return {
    type: UPDATE_POST,
    graphql: {
      query: `mutation (
        $id: ID,
        $type: String,
        $title: String,
        $details: String,
        $linkPreviewId: String,
        $communityIds: [String],
        $imageUrls: [String],
        $fileUrls: [String],
        $topicNames: [String],
        $memberIds: [ID]
      ) {
        updatePost(id: $id, data: {
          type: $type,
          title: $title,
          details: $details,
          linkPreviewId: $linkPreviewId,
          communityIds: $communityIds,
          imageUrls: $imageUrls,
          fileUrls: $fileUrls,
          topicNames: $topicNames,
          memberIds: $memberIds
        }) {${getPostFieldsFragment(false)}}
      }`,
      variables: {
        id,
        type,
        title,
        details,
        linkPreviewId,
        communityIds,
        imageUrls,
        fileUrls,
        topicNames,
        memberIds
      }
    },
    meta: {
      id,
      extractModel: {
        modelName: 'Post',
        getRoot: get('updatePost'),
        append: false
      },
      optimistic: true,
      analytics: {
        eventName: AnalyticsEvents.POST_UPDATED,
        detailsLength: textLength(details)
      }
    }
  }
}