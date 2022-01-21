import gql from 'graphql-tag'
import GroupFieldsFragment from 'graphql/fragments/GroupFieldsFragment'

export default gql`
  fragment GroupsQueryFragment on Query {
    groups(
      boundingBox: $boundingBox,
      context: $context,
      parentSlugs: $parentSlugs,
      search: $search,
      sortBy: $sortBy,
      visibility: $visibility
    ) {
      items {
        ...GroupFieldsFragment
      }
    }
  }

  ${GroupFieldsFragment}
`
