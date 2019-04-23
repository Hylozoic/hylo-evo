import postFieldsFragment from 'graphql/fragments/postFieldsFragment'

export default
`mutation (
  $type: String,
  $title: String,
  $details: String,
  $linkPreviewId: String,
  $communityIds: [String],
  $imageUrls: [String],
  $fileUrls: [String],
  $announcement: Boolean,
  $topicNames: [String],
  $acceptContributions: Boolean,
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
    topicNames: $topicNames,
    acceptContributions: $acceptContributions,
    eventInviteeIds: $eventInviteeIds,
    startTime: $startTime,
    endTime: $endTime,
    location: $location
  }) {${postFieldsFragment(false)}}
}`
