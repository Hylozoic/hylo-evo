import { PropTypes, Component } from 'react'
import { getSocket, socketUrl } from 'client/websockets'
import './SocketListener.scss'
const { func, object } = PropTypes

export default class SocketListener extends Component {
  static propTypes = {
    currentUser: object,
    addThreadFromSocket: func,
    addMessageFromSocket: func
  }

  componentDidMount () {
    const { addMessageFromSocket, addThreadFromSocket } = this.props
    this.socket = getSocket()
    this.socket.post(socketUrl('/noo/threads/subscribe'))
    this.socket.on('newThread', data => {
      addThreadFromSocket(convertThreadToModelFormat(data))
    })
    this.socket.on('messageAdded', data => {
      addMessageFromSocket(convertMessageToModelFormat(data.message, data.postId))
    })
    this.reconnectHandler = () => {
      this.socket.post(socketUrl('/noo/threads/subscribe'))
    }
    this.socket.on('reconnect', this.reconnectHandler)
  }

  componentWillUnmount () {
    this.socket.post(socketUrl('/noo/threads/unsubscribe'))
    this.socket.off('newThread')
    this.socket.off('messageAdded')
    this.socket.off('reconnect', this.reconnectHandler)
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
    updatetAt: new Date(updated_at).toString(),
    participants: people.map(({id, name, avatar_url}) => ({id, name, avatarUrl: avatar_url})),
    messages: comments.map(c => convertMessageToModelFormat(c, id))
  }
}
