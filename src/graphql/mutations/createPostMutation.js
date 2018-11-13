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
  $topicNames: [String]
) {
  createPost(data: {
    type: $type,
    title: $title,
    details: $details,
    linkPreviewId: $linkPreviewId,
    communityIds: $communityIds,
    imageUrls: $imageUrls,
    fileUrls: $fileUrls,
    announcement: $announcement
    topicNames: $topicNames
  }) {${getPostFieldsFragment(false)}}
}`
