import { PropTypes, Component } from 'react'
import { getSocket, socketUrl } from 'client/websockets'
import './SocketListener.scss'
const { func, object } = PropTypes

export default class SocketListener extends Component {
  static propTypes = {
    location: object,
    receiveThread: func,
    receiveMessage: func,
    receiveComment: func,
    receiveNotification: func,
    receivePost: func,
    addUserTyping: func,
    clearUserTyping: func
  }

  static handlers = {
    commentAdded: this.props.receiveComment,
    messageAdded: this.props.receiveMessage,
    newNotification: this.props.receiveNotification,
    newPost: this.props.receivePost,
    newThread: this.props.receiveThread,
    userTyping: this.userTypingHandler
  }

  componentDidMount () {
    this.socket = getSocket()
    this.reconnect()
    Object.keys(this.handlers).forEach(socketEvent =>
      this.socket.on(socketEvent, this.handlers[socketEvent]))
  }

  componentWillUnmount () {
    this.socket.post(socketUrl('/noo/threads/unsubscribe'))
    handledEvents.forEach(name =>
      this.socket.off(name, this[name]))
  }

  render () {
    return null
  }

  reconnect = () => {
    this.socket.post(socketUrl('/noo/threads/subscribe'))
  }

  userTypingHandler = ({userId, userName, isTyping}) => {
    const { addUserTyping, clearUserTyping } = this.props
    isTyping ? addUserTyping(userId, userName) : clearUserTyping(userId)
  }
}
