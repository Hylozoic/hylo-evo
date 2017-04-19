import {
  ADD_MESSAGE_FROM_SOCKET,
  ADD_THREAD_FROM_SOCKET
} from 'store/constants'

export function addMessageFromSocket (message, messageThreadId) {
  return {
    type: ADD_MESSAGE_FROM_SOCKET,
    payload: message,
    meta: {
      messageThreadId
    }
  }
}

export function addThreadFromSocket (thread) {
  return {
    type: ADD_THREAD_FROM_SOCKET,
    payload: thread
  }
}
