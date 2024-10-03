import { get } from 'lodash/fp'
import { TextHelpers, AnalyticsEvents } from 'hylo-shared'
import postFieldsFragment from '@graphql/fragments/postFieldsFragment'
import { CREATE_PROJECT } from 'store/constants'

export default function createProject (postParams) {
  const {
    acceptContributions,
    details,
    donationsLink,
    fileUrls,
    groups,
    imageUrls,
    linkPreview,
    memberIds = [],
    projectManagementLink,
    sendAnnouncement,
    title,
    topicNames,
    type
  } = postParams
  const linkPreviewId = linkPreview && linkPreview.id
  const groupIds = groups.map(c => c.id)

  return {
    type: CREATE_PROJECT,
    graphql: {
      query: `mutation (
        $acceptContributions: Boolean
        $announcement: Boolean
        $details: String
        $donationsLink: String
        $fileUrls: [String]
        $groupIds: [ID]
        $imageUrls: [String]
        $linkPreviewId: String
        $memberIds: [ID]
        $projectManagementLink: String
        $title: String
        $topicNames: [String]
      ) {
        createProject(data: {
          acceptContributions: $acceptContributions
          announcement: $announcement
          details: $details
          donationsLink: $donationsLink
          fileUrls: $fileUrls
          groupIds: $groupIds
          imageUrls: $imageUrls
          linkPreviewId: $linkPreviewId
          memberIds: $memberIds
          projectManagementLink: $projectManagementLink
          title: $title
          topicNames: $topicNames
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
