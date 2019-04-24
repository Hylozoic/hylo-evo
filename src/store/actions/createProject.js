import { get } from 'lodash/fp'
import { textLength } from 'hylo-utils/text'
import { AnalyticsEvents } from 'hylo-utils/constants'
import postFieldsFragment from 'graphql/fragments/postFieldsFragment'
import { CREATE_PROJECT } from 'store/constants'

export default function createProject (postParams) {
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
    memberIds = [],
    networkSlug,
    acceptContributions
  } = postParams
  const linkPreviewId = linkPreview && linkPreview.id
  const communityIds = communities.map(c => c.id)

  return {
    type: CREATE_PROJECT,
    graphql: {
      query: `mutation (
        $title: String,
        $details: String,
        $linkPreviewId: String,
        $communityIds: [String],
        $imageUrls: [String],
        $fileUrls: [String],
        $announcement: Boolean
        $topicNames: [String]
        $memberIds: [ID],
        $acceptContributions: Boolean
      ) {
        createProject(data: {
          title: $title,
          details: $details,
          linkPreviewId: $linkPreviewId,
          communityIds: $communityIds,
          imageUrls: $imageUrls,
          fileUrls: $fileUrls,
          announcement: $announcement
          topicNames: $topicNames
          memberIds: $memberIds
          acceptContributions: $acceptContributions
        }) {${postFieldsFragment(false)}}
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
        topicNames,
        memberIds,
        acceptContributions
      }
    },
    meta: {
      extractModel: {
        modelName: 'Post',
        getRoot: get('createProject')
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
