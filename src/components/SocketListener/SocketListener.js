import { PropTypes, Component } from 'react'
import { each, keys } from 'lodash/fp'
import { getSocket, socketUrl } from 'client/websockets'
import { STARTED_TYPING_INTERVAL } from 'components/MessageForm/MessageForm'
import './SocketListener.scss'
const { func, object } = PropTypes

const MS_CLEAR_TYPING = STARTED_TYPING_INTERVAL + 1000

export default class SocketListener extends Component {
  static propTypes = {
    currentUser: object,
    location: object,
    peopleTyping: object,
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
    this.clearTypingInterval = window && window.setInterval(this.clearTyping.bind(this), 1000)
  }

  componentWillUnmount () {
    this.socket.post(socketUrl('/noo/threads/unsubscribe'))
    this.socket.off('newThread')
    this.socket.off('messageAdded')
    this.socket.off('reconnect', this.reconnectHandler)
    this.socket.off('userTyping')
    window && window.clearInterval(this.clearTypingInterval)
  }

  addThreadFromSocket = data => {
    const { addThreadFromSocket } = this.props
    addThreadFromSocket(convertThreadToModelFormat(data))
  }

  addMessageFromSocket = data => {
    const { addMessageFromSocket, location } = this.props
    const [_, namespace, id] = location.pathname.split('/')
    const isActiveThread = namespace === 't' && data.postId === id
    const opts = {bumpUnreadCount: !isActiveThread}
    addMessageFromSocket(convertMessageToModelFormat(data.message, data.postId), opts)
  }

  clearTyping () {
    const { peopleTyping, clearUserTyping } = this.props
    const now = Date.now()
    const stale = user => now - user.timestamp > MS_CLEAR_TYPING
    each(userId => {
      if (stale(peopleTyping[userId])) {
        clearUserTyping(userId)
      }
    }, keys(peopleTyping))
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
