import { PropTypes, Component } from 'react'
import { getSocket, socketUrl } from 'client/websockets'
import './SocketListener.scss'
const { func, object } = PropTypes
import { each } from 'lodash'

export default class SocketListener extends Component {
  static propTypes = {
    location: object,
    addThreadFromSocket: func,
    addMessageFromSocket: func,
    addUserTyping: func,
    clearUserTyping: func
  }

  constructor (props) {
    super(props)

    this.handlers = {
      newThread: this.addThreadFromSocket,
      messageAdded: this.addMessageFromSocket,
      reconnect: this.reconnect,
      userTyping: this.userTyping
    }
  }

  componentDidMount () {
    this.socket = getSocket()
    this.reconnect()
    each(this.handlers, (handler, key) =>
      this.socket.on(key, handler))
  }

  componentWillUnmount () {
    this.socket.post(socketUrl('/noo/threads/unsubscribe'))
    each(this.handlers, (handler, key) =>
      this.socket.off(key, handler))
  }

  reconnect = () => {
    this.socket.post(socketUrl('/noo/threads/subscribe'))
  }

  addThreadFromSocket = data => {
    this.props.addThreadFromSocket(data)
  }

  addMessageFromSocket = data => {
    this.props.addMessageFromSocket(data)
  }

  userTyping = ({userId, userName, isTyping}) => {
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
