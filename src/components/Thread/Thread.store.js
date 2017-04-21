import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import {
  FETCH_THREAD
} from 'store/constants'

export const MODULE_NAME = 'Thread'

// Action Creators
export function fetchThread (id) {
  return {
    type: FETCH_THREAD,
    graphql: {
      query: `
        query ($id: ID) {
          messageThread (id: $id) {
            id
            unreadCount
            lastReadAt
            createdAt
            updatedAt
            participants {
              id
              name
              avatarUrl
            }
            messages(first: 40, order: "desc") {
              items {
                id
                text
                creator {
                  id
                  name
                  avatarUrl
                }
                createdAt
              }
              total
              hasMore
            }
          }
        }
      `,
      variables: {
        id
      }
    },
    meta: {
      extractModel: 'MessageThread'
    }
  }
}

// Selectors
export const moduleSelector = (state) => state[MODULE_NAME]

export const getThread = ormCreateSelector(
  orm,
  state => state.orm,
  (_, props) => props.threadId,
  (session, threadId) => {
    var thread
    try {
      thread = session.MessageThread.get({id: threadId})
    } catch (e) {
      return null
    }
    return {
      ...thread.ref,
      participants: thread.participants.toModelArray()
    }
  })
