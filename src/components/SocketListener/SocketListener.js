import { PropTypes, Component } from 'react'
import { getSocket, socketUrl } from 'client/websockets'
import './SocketListener.scss'
const { func, object } = PropTypes

export default class SocketListener extends Component {
  static propTypes = {
    location: object,
    addThreadFromSocket: func,
    addMessageFromSocket: func,
    addUserTyping: func,
    clearUserTyping: func
  }

  componentDidMount () {
    this.socket = getSocket()
    this.socket.post(socketUrl('/noo/threads/subscribe'))
    this.socket.on('newThread', this.addThreadFromSocket)
    this.socket.on('messageAdded', this.addMessageFromSocket)
    this.reconnectHandler = () => {
      this.socket.post(socketUrl('/noo/threads/subscribe'))
    }
    this.socket.on('reconnect', this.reconnectHandler)
    this.socket.on('userTyping', this.userTyping.bind(this))
  }

  componentWillUnmount () {
    this.socket.post(socketUrl('/noo/threads/unsubscribe'))
    this.socket.off('newThread')
    this.socket.off('messageAdded')
    this.socket.off('reconnect', this.reconnectHandler)
    this.socket.off('userTyping')
  }

  addThreadFromSocket = data => {
    const { addThreadFromSocket } = this.props
    addThreadFromSocket(convertThreadToModelFormat(data))
  }

  addMessageFromSocket = data => {
    const { addMessageFromSocket, location } = this.props
    const opts = {bumpUnreadCount: !isActiveThread(location, data)}
    addMessageFromSocket(convertMessageToModelFormat(data.message, data.postId), opts)
  }

  userTyping ({userId, userName, isTyping}) {
    const { addUserTyping, clearUserTyping } = this.props
    if (isTyping) {
      addUserTyping(userId, userName)
    } else {
      clearUserTyping(userId)
    }
  }

  render () {
    return null
  }
}

function isActiveThread (location, data) {
  const [ namespace, id ] = location.pathname.split('/').slice(1, 3)
  return namespace === 't' && data.postId === id
}

function convertMessageToModelFormat ({ id, created_at, text, user_id }, messageThreadId) {
  return {
    id,
    createdAt: new Date(created_at).toString(),
    text,
    creator: user_id,
    messageThread: messageThreadId
  }
}

function convertThreadToModelFormat (data) {
  const { id, created_at, updated_at, people, comments } = data
  return {
    id,
    createdAt: new Date(created_at).toString(),
    updatedAt: new Date(updated_at).toString(),
    participants: people.map(({id, name, avatar_url}) => ({id, name, avatarUrl: avatar_url})),
    messages: comments.map(c => convertMessageToModelFormat(c, id)),
    unreadCount: 1
  }
}
