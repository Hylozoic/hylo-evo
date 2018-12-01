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
  $memberIds: [ID]
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
    memberIds: $memberIds
  }) {${getPostFieldsFragment(false)}}
}`
