export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
const RECEIVE_COMMENT = 'RECEIVE_COMMENT'
export const RECEIVE_POST = 'RECEIVE_POST'
const RECEIVE_THREAD = 'RECEIVE_THREAD'

export function receiveMessage (message, opts = {}) {
  return {
    type: RECEIVE_MESSAGE,
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

export function receiveComment (comment, opts = {}) {
  return {
    type: RECEIVE_COMMENT,
    payload: {
      data: {
        comment
      }
    },
    meta: {
      extractModel: 'Comment'
    }
  }
}

export function receiveThread (thread) {
  return {
    type: RECEIVE_THREAD,
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

export function receivePost (data, communityId) {
  return {
    type: RECEIVE_POST,
    payload: {topics: data.tags, communityId}
  }
}
