import { PropTypes, Component } from 'react'
import { getSocket, socketUrl } from 'client/websockets'
import './SocketListener.scss'
const { func, object } = PropTypes

export const handledEvents = [
  'newThread',
  'messageAdded',
  'commentAdded',
  'userTyping',
  'reconnect'
]

export default class SocketListener extends Component {
  static propTypes = {
    location: object,
    receiveThread: func,
    receiveMessage: func,
    receiveComment: func,
    addUserTyping: func,
    clearUserTyping: func
  }

  componentDidMount () {
    this.socket = getSocket()
    this.reconnect()
    handledEvents.forEach(name =>
      this.socket.on(name, this[name]))
  }

  componentWillUnmount () {
    this.socket.post(socketUrl('/noo/threads/unsubscribe'))
    handledEvents.forEach(name =>
      this.socket.off(name, this[name]))
  }

  render () {
    return null
  }

  // the methods below are websocket event handlers and are named for the event
  // they handle.

  reconnect = () => {
    this.socket.post(socketUrl('/noo/threads/subscribe'))
  }

  newThread = data => {
    this.props.receiveThread(data)
  }

  messageAdded = data => {
    this.props.receiveMessage(data)
  }

  commentAdded = data => {
    this.props.receiveComment(data)
  }

  userTyping = ({userId, userName, isTyping}) => {
    const { addUserTyping, clearUserTyping } = this.props
    if (isTyping) {
      addUserTyping(userId, userName)
    } else {
      clearUserTyping(userId)
    }
  }
}
