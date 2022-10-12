import postFieldsFragment from '../fragments/postFieldsFragment'

export default
`mutation (
  $id: ID,
  $type: String,
  $title: String,
  $details: String,
  $linkPreviewId: String,
  $linkPreviewFeatured: Boolean,
  $groupIds: [String],
  $imageUrls: [String],
  $fileUrls: [String],
  $topicNames: [String],
  $memberIds: [ID],
  $acceptContributions: Boolean,
  $donationsLink: String,
  $projectManagementLink: String,
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
    linkPreviewFeatured: $linkPreviewFeatured,
    groupIds: $groupIds,
    imageUrls: $imageUrls,
    fileUrls: $fileUrls,
    topicNames: $topicNames,
    memberIds: $memberIds,
    acceptContributions: $acceptContributions,
    donationsLink: $donationsLink,
    projectManagementLink: $projectManagementLink,
    eventInviteeIds: $eventInviteeIds,
    startTime: $startTime,
    endTime: $endTime,
    location: $location,
    locationId: $locationId,
    isPublic: $isPublic
  }) {${postFieldsFragment(false)}}
}`
