import { get } from 'lodash/fp'
import { textLength } from 'hylo-utils/text'
import { AnalyticsEvents } from 'hylo-utils/constants'
import { getPostFieldsFragment } from 'store/actions/fetchPost'
import { CREATE_POST } from 'store/constants'

export default function createPost (postParams) {
  const {
    type,
    title,
    details,
    communities,
    linkPreview,
    imageUrls,
    fileUrls,
    topicNames,
    sendAnnouncement,
    networkSlug
  } = postParams
  const linkPreviewId = linkPreview && linkPreview.id
  const communityIds = communities.map(c => c.id)

  return {
    type: CREATE_POST,
    graphql: {
      query: `mutation (
        $type: String,
        $title: String,
        $details: String,
        $linkPreviewId: String,
        $communityIds: [String],
        $imageUrls: [String],
        $fileUrls: [String],
        $announcement: Boolean
        $topicNames: [String]
      ) {
        createPost(data: {
          type: $type,
          title: $title,
          details: $details,
          linkPreviewId: $linkPreviewId,
          communityIds: $communityIds,
          imageUrls: $imageUrls,
          fileUrls: $fileUrls,
          announcement: $announcement
          topicNames: $topicNames
        }) {${getPostFieldsFragment(false)}}
      }`,
      variables: {
        type,
        title,
        details,
        linkPreviewId,
        communityIds,
        imageUrls,
        fileUrls,
        announcement: sendAnnouncement,
        topicNames
      }
    },
    meta: {
      extractModel: {
        modelName: 'Post',
        getRoot: get('createPost')
      },
      networkSlug,
      analytics: {
        eventName: AnalyticsEvents.POST_CREATED,
        detailsLength: textLength(details),
        isAnnouncement: sendAnnouncement
      }
    }
  }
}
