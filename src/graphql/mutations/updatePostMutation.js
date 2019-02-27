import getPostFieldsFragment from '../fragments/getPostFieldsFragment'

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
  $eventInviteeIds: [ID],
  $startTime: String,
  $endTime: String,
  $location: String
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
    eventInviteeIds: $eventInviteeIds,
    startTime: $startTime,
    endTime: $endTime,
    location: $location
  }) {${getPostFieldsFragment(false)}}
}`
