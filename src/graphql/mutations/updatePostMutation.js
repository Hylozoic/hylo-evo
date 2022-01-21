import gql from 'graphql-tag'
import PostFieldsFragment from '../fragments/PostFieldsFragment'

export default gql`
  mutation (
    $id: ID,
    $type: String,
    $title: String,
    $details: String,
    $linkPreviewId: String,
    $groupIds: [String],
    $imageUrls: [String],
    $fileUrls: [String],
    $topicNames: [String],
    $memberIds: [ID],
    $acceptContributions: Boolean,
    $eventInviteeIds: [ID],
    $startTime: Date,
    $endTime: Date,
    $location: String,
    $locationId: ID,
    $isPublic: Boolean
  ) {
    updatePost(id: $id, data: {
      type: $type,
      title: $title,
      details: $details,
      linkPreviewId: $linkPreviewId,
      groupIds: $groupIds,
      imageUrls: $imageUrls,
      fileUrls: $fileUrls,
      topicNames: $topicNames,
      memberIds: $memberIds,
      acceptContributions: $acceptContributions,
      eventInviteeIds: $eventInviteeIds,
      startTime: $startTime,
      endTime: $endTime,
      location: $location,
      locationId: $locationId,
      isPublic: $isPublic
    }) {
      ...PostFieldsFragment      
    }
  }

  ${PostFieldsFragment}
`
