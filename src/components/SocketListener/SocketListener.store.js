import {
  ADD_MESSAGE_FROM_SOCKET,
  ADD_THREAD_FROM_SOCKET,
  ADD_USER_TYPING
} from 'store/constants'

export function mapEventsToActions () {
  return {
    newThread: addThreadFromSocket,
    messageAdded: addMessageFromSocket,
    userTyping: addUserTyping
  }
}

export function addMessageFromSocket (message, opts = {}) {
  return {
    type: ADD_MESSAGE_FROM_SOCKET,
    payload: {
      data: {
        message
      }
    },
    meta: {
      extractModel: 'Message',
      bumpUnreadCount: opts.bumpUnreadCount
    }
  }
}

export function addThreadFromSocket (thread) {
  return {
    type: ADD_THREAD_FROM_SOCKET,
    payload: {
      data: {
        thread
      }
    },
    meta: {
      extractModel: 'MessageThread'
    }
  }
}
