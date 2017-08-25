import { CREATE_COMMUNITY } from 'store/constants'

export function createCommunity (name) {
  return {
    type: CREATE_COMMUNITY,
    graphql: {
      query: `mutation ($name: String) {
        createCommunity(data: {name: $name}) {
          id
          community {
            name
          }
        }
      }`,
      variables: {
        name
      }
    },
    meta: {
      optimistic: true,
      extractModel: 'Community',
      name
    }
  }
}
