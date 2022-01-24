import gql from 'graphql-tag'

export default gql`
  mutation CreateSavedSearchMutation(
    $boundingBox: [PointInput],
    $groupSlug: String,
    $context: String,
    $lastPostId: ID,
    $name: String,
    $postTypes: [String],
    $searchText: String,
    $topicIds: [ID],
    $userId: ID
  ) {
    createSavedSearch(data: {
      boundingBox: $boundingBox,
      groupSlug: $groupSlug,
      context: $context,
      lastPostId: $lastPostId,
      name: $name,
      postTypes: $postTypes,
      searchText: $searchText,
      topicIds: $topicIds,
      userId: $userId
    }) {
      id
      name
      boundingBox
      createdAt
      context
      group {
        name
        slug
      }
      isActive
      searchText
      topics {
        id
        name
      }
      postTypes
    }
  }
`
