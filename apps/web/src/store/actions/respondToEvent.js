import { AnalyticsEvents } from 'hylo-shared'
import { RESPOND_TO_EVENT } from 'store/constants'

export default function respondToEvent (post, response) {
  return {
    type: RESPOND_TO_EVENT,
    graphql: {
      query: `mutation($id: ID, $response: String) {
        respondToEvent(id: $id, response: $response) {
          success
        }
      }`,
      variables: { id: post.id, response }
    },
    meta: {
      id: post.id,
      response,
      optimistic: true,
      analytics: {
        eventName: AnalyticsEvents.EVENT_RSVP,
        groupId: post.groups.map(g => g.id),
        response
      }
    }
  }
}
