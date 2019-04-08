import { uniqueId } from 'lodash/fp'
import { createSelector } from 'reselect'
import { AnalyticsEvents } from 'hylo-utils/constants'
import { CREATE_MESSAGE, CREATE_MESSAGE_PENDING } from 'store/constants'
import {
  NEW_THREAD_ID
} from './MessageForm'

export const MODULE_NAME = 'MessageForm'

// Constants
export const UPDATE_MESSAGE_TEXT = 'UPDATE_MESSAGE_TEXT'

// Action Creators
export function createMessage (messageThreadId, text, forNewThread, holochainAPI = false) {
  const createdAt = new Date().getTime().toString()
  return {
    type: CREATE_MESSAGE,
    graphql: {
      query: `mutation ($messageThreadId: String, $text: String, $createdAt: String) {
        createMessage(data: {messageThreadId: $messageThreadId, text: $text, createdAt: $createdAt}) {
          id
          text
          createdAt
          creator {
            id
          }
          messageThread {
            id
          }
        }
      }`,
      variables: {
        messageThreadId,
        text,
        createdAt
      }
    },
    meta: {
      holochainAPI,
      optimistic: true,
      extractModel: 'Message',
      tempId: uniqueId(`messageThread${messageThreadId}_`),
      messageThreadId,
      text,
      forNewThread,
      analytics: AnalyticsEvents.DIRECT_MESSAGE_SENT
    }
  }
}

export function updateMessageText (messageThreadId, text) {
  return {
    type: UPDATE_MESSAGE_TEXT,
    meta: {
      messageThreadId,
      text
    }
  }
}

// Reducer
const defaultState = {}

export default function reducer (state = defaultState, action) {
  const { error, type, meta } = action
  if (error) return state

  switch (type) {
    case CREATE_MESSAGE_PENDING:
      const threadId = meta.forNewThread ? NEW_THREAD_ID : meta.messageThreadId
      return {...state, [threadId]: ''}
    case UPDATE_MESSAGE_TEXT:
      return {...state, [meta.messageThreadId]: meta.text}
    default:
      return state
  }
}

// Selectors
export const moduleSelector = (state) => state[MODULE_NAME]

export const getTextForMessageThread = createSelector(
  moduleSelector,
  (_, props) => props.messageThreadId,
  (_, props) => props.forNewThread,
  (state, messageThreadId, forNewThread) => forNewThread ? state[NEW_THREAD_ID] : (state[messageThreadId] || '')
)
