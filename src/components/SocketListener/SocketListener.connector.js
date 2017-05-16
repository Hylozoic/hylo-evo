import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  receiveComment,
  receiveMessage,
  receiveThread
} from './SocketListener.store'
import {
  addUserTyping,
  clearUserTyping
} from 'components/PeopleTyping/PeopleTyping.store'

export function mapDispatchToProps (dispatch, props) {
  return {
    receiveThread: data =>
      dispatch(receiveThread(convertToThread(data))),

    receiveMessage: data => {
      const message = convertToMessage(data.message, data.postId)
      return dispatch(receiveMessage(message, {
        bumpUnreadCount: !isActiveThread(props.location, data)
      }))
    },

    receiveComment: data => {
      const comment = convertToComment(data.comment, data.postId)
      return dispatch(receiveComment(comment))
    },

    ...bindActionCreators({
      addUserTyping,
      clearUserTyping
    }, dispatch)
  }
}

export default connect(null, mapDispatchToProps)

function convertToThread (data) {
  const { id, created_at, updated_at, people, comments } = data
  return {
    id,
    createdAt: new Date(created_at).toString(),
    updatedAt: new Date(updated_at).toString(),
    participants: people.map(({id, name, avatar_url}) => ({id, name, avatarUrl: avatar_url})),
    messages: comments.map(c => convertToMessage(c, id)),
    unreadCount: 1
  }
}

function convertToMessage ({ id, created_at, text, user_id }, messageThreadId) {
  return {
    id,
    createdAt: new Date(created_at).toString(),
    text,
    creator: user_id,
    messageThread: messageThreadId
  }
}

function isActiveThread (location, data) {
  const [ namespace, id ] = location.pathname.split('/').slice(1, 3)
  return namespace === 't' && data.postId === id
}

function convertToComment ({ id, text, created_at, user_id }, postId) {
  return {
    id,
    text,
    createdAt: new Date(created_at).toString(),
    creator: user_id,
    post: postId
  }
}
