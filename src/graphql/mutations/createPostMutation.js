import getPostFieldsFragment from 'graphql/fragments/getPostFieldsFragment'

export default
`mutation (
  $type: String,
  $title: String,
  $details: String,
  $linkPreviewId: String,
  $communityIds: [String],
  $imageUrls: [String],
  $fileUrls: [String],
  $announcement: Boolean
  $topicNames: [String],
  $eventInviteeIds: [ID],
  $startTime: String,
  $endTime: String,
  $location: String
) {
  createPost(data: {
    type: $type,
    title: $title,
    details: $details,
    linkPreviewId: $linkPreviewId,
    communityIds: $communityIds,
    imageUrls: $imageUrls,
    fileUrls: $fileUrls,
    announcement: $announcement,
    eventInviteeIds: $eventInviteeIds,
    topicNames: $topicNames,
    startTime: $startTime,
    endTime: $endTime,
    location: $location
  }) {${getPostFieldsFragment(false)}}
}`
