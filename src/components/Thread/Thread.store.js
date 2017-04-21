import { sortBy } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import {
  FETCH_THREAD,
  FETCH_BEFORE_MESSAGES,
  FETCH_AFTER_MESSAGES
} from 'store/constants'

export const MODULE_NAME = 'Thread'

// Action Creators
export function fetchThread (threadId) {
  return {
    type: FETCH_THREAD,
    graphql: {
      query: `
        query ($threadId: ID) {
          messageThread (id: $threadId) {
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
            messages(first: 20) {
              id
              createdAt
              text
              creator {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        threadId
      }
    },
    meta: {
      extractModel: 'MessageThread'
    }
  }
}

export function fetchBeforeMessages (threadId, cursor) {
  return {
    type: FETCH_BEFORE_MESSAGES,
    graphql: {
      query: `
        query ($threadId: ID, $cursor: ID) {
          messageThread (id: $threadId) {
            id
            messages(first: 20, cursor: $cursor) {
              id
              createdAt
              text
              creator {
                id
                name
                avatarUrl
              }
            }
          }
        }
      `,
      variables: {
        threadId,
        cursor
      }
    },
    meta: {
      rootModelName: 'MessageThread'
    }
  }
}

export function fetchAfterMessages () {
  return {
    type: FETCH_AFTER_MESSAGES
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
      participants: thread.participants.toModelArray(),
      messages: sortBy(m => new Date(m.createdAt).getTime(),
        thread.messages.toModelArray().map(m => ({...m.ref, creator: m.creator.ref})))
    }
  })
