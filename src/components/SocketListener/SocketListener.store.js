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

export function receivePost (data, communityId) {
  return {
    type: RECEIVE_POST,
    payload: {
      topics: data.tags,
      creatorId: data.creatorId,
      communityId
    }
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

export function ormSessionReducer (session, { meta, type, payload }) {
  const { MessageThread, Membership, CommunityTopic, Me } = session
  let currentUser

  switch (type) {
    case RECEIVE_MESSAGE:
      const id = payload.data.message.messageThread
      if (!MessageThread.idExists(id)) {
        MessageThread.create({
          id,
          updatedAt: new Date().toString(),
          lastReadAt: 0,
          unreadCount: 0
        })
      }
      MessageThread.withId(id).newMessageReceived(meta.bumpUnreadCount)
      break

    case RECEIVE_POST:
      currentUser = Me.first()
      if (currentUser && payload.creatorId !== currentUser.id) {
        const increment = obj =>
          obj && obj.update({
            newPostCount: (obj.newPostCount || 0) + 1
          })

        payload.topics.forEach(topicId => {
          increment(CommunityTopic.safeGet({
            topic: topicId, community: payload.communityId
          }))
        })

        increment(Membership.filter(m =>
          !m.person && m.community === payload.communityId).first())
      }
      break

    case RECEIVE_NOTIFICATION:
      currentUser = Me.first()
      currentUser.update({
        newNotificationCount: currentUser.newNotificationCount + 1
      })
      break
  }
}
