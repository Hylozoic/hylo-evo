import { AnalyticsEvents } from 'hylo-utils/constants'
import { BLOCK_USER } from '../constants'

export default function blockUser (blockedUserId) {
  return {
    type: BLOCK_USER,
    graphql: {
      query: `mutation ($blockedUserId: ID) {
        blockUser (blockedUserId: $blockedUserId) {
          success
        }
      }`,
      variables: {
        blockedUserId
      }
    },
    meta: {
      analytics: AnalyticsEvents.BLOCK_USER
    }
  }
}
