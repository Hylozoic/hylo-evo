import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import {
  receiveComment,
  receiveMessage,
  receiveNotification,
  receivePost,
  receiveThread
} from './SocketListener.store'
import {
  addUserTyping,
  clearUserTyping
} from 'components/PeopleTyping/PeopleTyping.store'
import getMe from 'store/selectors/getMe'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'

function mapStateToProps (state, props) {
  return {
    group: getGroupForCurrentRoute(state, props),
    currentUser: getMe(state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    receiveThread: data => dispatch(receiveThread(convertToThread(data))),
    receiveNotification: data => dispatch(receiveNotification(data)),
    receiveComment: data => dispatch(receiveComment(data)),

    receiveMessage: data => {
      const message = convertToMessage(data)
      return dispatch(receiveMessage(message, {
        bumpUnreadCount: !isActiveThread(props.location, data)
      }))
    },

    ...bindActionCreators({
      addUserTyping,
      clearUserTyping,
      receivePost
    }, dispatch)
  }
}

function mergeProps (stateProps, dispatchProps) {
  const groupId = get('id', stateProps.group)
  return {
    ...stateProps,
    ...dispatchProps,
    receivePost: data => {
      return dispatchProps.receivePost(data, groupId)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)

function convertToThread (data) {
  if (data.createdAt) {
    // data is already in GraphQL/redux-orm style
    return {
      ...data,
      createdAt: new Date(data.createdAt).toString(),
      updatedAt: new Date(data.updatedAt).toString(),
      messages: data.messages.map(({ id, createdAt, text, creator }) => ({
        id,
        text,
        creator,
        createdAt: new Date(createdAt).toString(),
        messageThread: data.id
      })),
      unreadCount: 1
    }
  }

  const { id, created_at: createdAt, updated_at: updatedAt, people, comments } = data
  return {
    id,
    createdAt: new Date(createdAt).toString(),
    updatedAt: new Date(updatedAt).toString(),
    participants: people.map(({ id, name, avatar_url: avatarUrl }) => ({ id, name, avatarUrl })),
    messages: comments.map(c => convertToMessage({ message: c, postId: id })),
    unreadCount: 1
  }
}

function convertToMessage (data) {
  if (data.createdAt) {
    // data is already in GraphQL/redux-orm style
    return {
      ...data,
      createdAt: new Date(data.createdAt).toString()
    }
  }

  const { message: { id, created_at: createdAt, text, user_id: userId }, postId } = data
  return {
    id,
    createdAt: new Date(createdAt).toString(),
    text,
    creator: userId,
    messageThread: postId
  }
}

function isActiveThread (location, data) {
  const [ namespace, id ] = location.pathname.split('/').slice(1, 3)
  return namespace === 't' && data.postId === id
}
