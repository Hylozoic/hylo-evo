import { get } from 'lodash/fp'
import { TextHelpers, AnalyticsEvents } from 'hylo-shared'
import postFieldsFragment from 'graphql/fragments/postFieldsFragment'
import { CREATE_PROJECT } from 'store/constants'

export default function createProject (postParams) {
  const {
    type,
    title,
    details,
    groups,
    linkPreview,
    imageUrls,
    fileUrls,
    topicNames,
    sendAnnouncement,
    memberIds = [],
    acceptContributions,
    donationsLink,
    projectManagementLink
  } = postParams
  const linkPreviewId = linkPreview && linkPreview.id
  const groupIds = groups.map(c => c.id)

  return {
    type: CREATE_PROJECT,
    graphql: {
      query: `mutation (
        $title: String
        $details: String
        $linkPreviewId: String
        $groupIds: [String]
        $imageUrls: [String]
        $fileUrls: [String]
        $announcement: Boolean
        $topicNames: [String]
        $memberIds: [ID]
        $acceptContributions: Boolean
        $donationsLink: String
        $projectManagementLink: String
      ) {
        createProject(data: {
          title: $title
          details: $details
          linkPreviewId: $linkPreviewId
          groupIds: $groupIds
          imageUrls: $imageUrls
          fileUrls: $fileUrls
          announcement: $announcement
          topicNames: $topicNames
          memberIds: $memberIds
          acceptContributions: $acceptContributions
          donationsLink: $donationsLink
          projectManagementLink: $projectManagementLink
        }) {${postFieldsFragment(false)}}
      }`,
      variables: {
        type,
        title,
        details,
        linkPreviewId,
        groupIds,
        imageUrls,
        fileUrls,
        announcement: sendAnnouncement,
        topicNames,
        memberIds,
        acceptContributions,
        donationsLink,
        projectManagementLink
      }
    },
    meta: {
      extractModel: {
        modelName: 'Post',
        getRoot: get('createProject')
      },
      analytics: {
        eventName: AnalyticsEvents.POST_CREATED,
        detailsLength: TextHelpers.textLengthHTML(details),
        isAnnouncement: sendAnnouncement
      }
    }
  }
}
