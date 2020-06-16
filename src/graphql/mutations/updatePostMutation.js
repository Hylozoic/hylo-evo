import postFieldsFragment from '../fragments/postFieldsFragment'

export default
`mutation (
  $id: ID,
  $type: String,
  $title: String,
  $details: String,
  $linkPreviewId: String,
  $communityIds: [String],
  $imageUrls: [String],
  $fileUrls: [String],
  $topicNames: [String],
  $memberIds: [ID],
  $acceptContributions: Boolean,
  $eventInviteeIds: [ID],
  $startTime: String,
  $endTime: String,
  $location: String,
  $locationId: ID,
  $isPublic: Boolean
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
    memberIds: $memberIds,
    acceptContributions: $acceptContributions,
    eventInviteeIds: $eventInviteeIds,
    startTime: $startTime,
    endTime: $endTime,
    location: $location,
    locationId: $locationId,
    isPublic: $isPublic
  }) {${postFieldsFragment(false)}}
}`
