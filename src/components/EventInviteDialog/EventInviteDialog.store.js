export const MODULE_NAME = 'EventInviteDialog'
export const INVITE_PEOPLE_TO_EVENT = `${MODULE_NAME}/INVITE_PEOPLE_TO_EVENT`
export const INVITE_PEOPLE_TO_EVENT_PENDING = `${INVITE_PEOPLE_TO_EVENT}_PENDING`

export function invitePeopleToEvent (eventId, inviteeIds) {
  return {
    type: INVITE_PEOPLE_TO_EVENT,
    graphql: {
      query: `mutation ($eventId: ID, $inviteeIds: [ID]) {
        invitePeopleToEvent(eventId: $eventId, inviteeIds: $inviteeIds) {
          id
          eventInvitations {
            total
            hasMore
            items {
              id
              response
              person {
                id
                name
                avatarUrl
              }      
            }       
          } 
        }
      }`,
      variables: { eventId, inviteeIds }
    },
    meta: {
      eventId,
      inviteeIds,
      optimistic: true,
      extractModel: 'Post'
    }
  }
}
