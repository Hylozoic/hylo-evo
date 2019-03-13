import { get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import {
  FETCH_THREAD,
  FETCH_MESSAGES
} from 'store/constants'

export const MODULE_NAME = 'Thread'

// Action Creators
export function fetchThread (id, holoChatAPI) {
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
      holoChatAPI,
      extractModel: 'MessageThread',
      extractQueryResults: {
        getType: () => FETCH_MESSAGES,
        getItems: get('payload.data.messageThread.messages')
      }
    }
  }
}

// Selectors
export const moduleSelector = (state) => state[MODULE_NAME]

export const getThread = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { match }) => match.params.threadId,
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
