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
  $announcement: Boolean,
  $topicNames: [String],
  $acceptContributions: Boolean
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
    acceptContributions: $acceptContributions
  }) {${getPostFieldsFragment(false)}}
}`
