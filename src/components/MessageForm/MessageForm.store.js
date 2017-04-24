import { uniqueId } from 'lodash/fp'
import { createSelector } from 'reselect'
import { CREATE_MESSAGE, CREATE_MESSAGE_PENDING } from 'store/constants'

export const MODULE_NAME = 'MessageForm'

// Constants
export const UPDATE_MESSAGE_TEXT = 'UPDATE_MESSAGE_TEXT'

// Action Creators
export function createMessage (messageThreadId, text, userId) {
  return {
    type: CREATE_MESSAGE,
    graphql: {
      query: `mutation ($messageThreadId: String, $text: String) {
        createMessage(data: {messageThreadId: $messageThreadId, text: $text}) {
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
        text
      }
    },
    meta: {
      optimistic: true,
      extractModel: 'Message',
      tempId: uniqueId(`messageThread${messageThreadId}_`),
      messageThreadId,
      text
    }
  }
}

export function updateText (messageThreadId, text) {
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
      return {...state, [meta.messageThreadId]: ''}
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
  (state, messageThreadId) => state[messageThreadId] || ''
)
