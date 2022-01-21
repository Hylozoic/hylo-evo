import gql from 'graphql-tag'
import PostFieldsFragment from 'graphql/fragments/PostFieldsFragment'

export default gql`
  mutation CreatePostMutation(
    $type: String,
    $title: String,
    $details: String,
    $linkPreviewId: String,
    $groupIds: [String],
    $imageUrls: [String],
    $fileUrls: [String],
    $announcement: Boolean,
    $topicNames: [String],
    $acceptContributions: Boolean,
    $eventInviteeIds: [ID],
    $memberIds: [ID],
    $startTime: Date,
    $endTime: Date,
    $location: String,
    $locationId: ID,
    $isPublic: Boolean
    $withComments: Boolean = false
  ) {
    createPost(data: {
      type: $type,
      title: $title,
      details: $details,
      linkPreviewId: $linkPreviewId,
      groupIds: $groupIds,
      imageUrls: $imageUrls,
      fileUrls: $fileUrls,
      announcement: $announcement,
      topicNames: $topicNames,
      acceptContributions: $acceptContributions,
      eventInviteeIds: $eventInviteeIds,
      memberIds: $memberIds,
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
