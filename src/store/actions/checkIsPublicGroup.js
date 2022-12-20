import gql from 'graphql-tag'

export default function checkIsPublicGroup (groupSlug) {
  return {
    type: 'IS_GROUP_PUBLIC',
    graphql: {
      query: gql`
        query CheckIsGroupPublic ($slug: String) {
          group (slug: $slug) {
            visibility
          }
        }
      `,
      variables: { slug: groupSlug }
    },
    meta: { extractModel: 'Group' }
  }
}
