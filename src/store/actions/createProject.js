import { get } from 'lodash/fp'
import { textLength } from 'hylo-utils/text'
import { AnalyticsEvents } from 'hylo-utils/constants'
import PostFieldsFragment from 'graphql/PostFieldsFragment'
import { CREATE_PROJECT } from 'store/constants'
import gql from 'graphql-tag'

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
    acceptContributions
  } = postParams
  const linkPreviewId = linkPreview && linkPreview.id
  const groupIds = groups.map(c => c.id)

  return {
    type: CREATE_PROJECT,
    graphql: {
      query: gql`
        mutation CreateProjectMutation(
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
          }) {
            ...PostFieldsFragment
          }
        }
        ${PostFieldsFragment}
      `,
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
        acceptContributions
      }
    },
    meta: {
      extractModel: {
        modelName: 'Post',
        getRoot: get('createProject')
      },
      analytics: {
        eventName: AnalyticsEvents.POST_CREATED,
        detailsLength: textLength(details),
        isAnnouncement: sendAnnouncement
      }
    }
  }
}
