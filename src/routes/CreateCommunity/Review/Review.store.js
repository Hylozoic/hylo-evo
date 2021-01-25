import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { AnalyticsEvents } from 'hylo-utils/constants'

export const MODULE_NAME = `Review`
export const CREATE_COMMUNITY = `${MODULE_NAME}/CREATE_COMMUNITY`

export function createCommunity (name, slug, networkId) {
  const data = {
    name,
    slug
  }

  if (networkId) {
    data.networkId = networkId
  }

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
        data
      }
    },
    meta: {
      extractModel: 'Membership',
      ...data,
      analytics: AnalyticsEvents.COMMUNITY_CREATED
    }
  }
}

export const getNetwork = ormCreateSelector(
  orm,
  (state, { networkId }) => networkId,
  (session, networkId) => {
    const network = session.Network.safeGet({ id: networkId })
    if (network) {
      return network
    }
    return null
  }
)
