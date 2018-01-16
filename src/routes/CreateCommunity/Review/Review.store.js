import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'

export const MODULE_NAME = `Review`
export const CREATE_COMMUNITY = `${MODULE_NAME}/CREATE_COMMUNITY`

export function createCommunity (name, slug, networkId) {
  return {
    type: CREATE_COMMUNITY,
    graphql: {
      query: `mutation ($data: CommunityInput) {
        createCommunity(data: $data) {
          id
          hasModeratorRole
          community {
            id
            name
            slug
            network {
              id
            }
          }
        }
      }
      `,
      variables: {
        data: {
          name,
          slug,
          networkId
        }
      }
    },
    meta: {
      extractModel: 'Membership',
      slug,
      name,
      networkId
    }
  }
}

export const getNetwork = ormCreateSelector(
  orm,
  state => state.orm,
  (state, { networkId }) => networkId,
  (session, networkId) => {
    const network = session.Network.safeGet({ id: networkId })
    if (network) {
      return network
    }
    return null
  }
)
