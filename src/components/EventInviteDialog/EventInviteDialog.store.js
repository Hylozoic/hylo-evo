import { createSelector } from 'redux-orm'
import orm from 'store/models'
import getMe from 'store/selectors/getMe'
import { pick, uniqBy, orderBy, flow, reject, map, reduce } from 'lodash/fp'

export const MODULE_NAME = 'EventInviteDialog'
export const INVITE_PEOPLE_TO_EVENT = `${MODULE_NAME}/INVITE_PEOPLE_TO_EVENT`
export const INVITE_PEOPLE_TO_EVENT_PENDING = `${INVITE_PEOPLE_TO_EVENT}_PENDING`

export const peopleSelector = createSelector(
  orm,
  getMe,
  (_, props) => props.forCommunities,
  (
    { Community },
    currentUser,
    forCommunities
  ) => {
    const forCommunityIds = forCommunities.map(c => c.id)
    const communities = Community
      .filter(c => forCommunityIds ? forCommunityIds.includes(c.id) : true)
      .toModelArray()
    const processors = [
      reduce((result, c) => result.concat(c.members.toModelArray()), []),
      uniqBy('id'),
      reject(p => currentUser ? currentUser.id === p.id : false),
      map(pick([ 'id', 'name', 'avatarUrl' ])),
      orderBy('name', 'asc')
    ]

    return flow(processors)(communities)
  }
)

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
