export const FETCH_COMMON_ROLES = 'FETCH_COMMON_ROLES'

export default function fetchCommonRoles () {
  return {
    type: FETCH_COMMON_ROLES,
    graphql: {
      query: `query FetchCommonRoles {
        commonRoles {
            id
            name
            description
            emoji
            responsibilities {
              items {
                id
                title
                description
              }
            }
        }
      }`,
      variables: { }
    },
    meta: {
      extractModel: 'CommonRole'
    }
  }
}
