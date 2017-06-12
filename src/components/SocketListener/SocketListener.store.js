const MODULE_NAME = 'SocketListener'
export const RECEIVE_MESSAGE = `${MODULE_NAME}/RECEIVE_MESSAGE`
export const RECEIVE_COMMENT = `${MODULE_NAME}/RECEIVE_COMMENT`
export const RECEIVE_POST = `${MODULE_NAME}/RECEIVE_POST`
export const RECEIVE_THREAD = `${MODULE_NAME}/RECEIVE_THREAD`
export const RECEIVE_NOTIFICATION = `${MODULE_NAME}/RECEIVE_NOTIFICATION`

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

export function receivePost (data, communityId, creatorId) {
  console.log('!!!', 'receivePost socket event')
  return {
    type: RECEIVE_POST,
    payload: {topics: data.tags, communityId, creatorId}
  }
}

export function receiveNotification (notification) {
  return {
    type: RECEIVE_NOTIFICATION,
    payload: {
      data: {
        notification
      }
    },
    meta: {
      extractModel: 'Notification'
    }
  }
}
