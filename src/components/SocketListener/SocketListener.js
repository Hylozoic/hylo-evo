import PropTypes from 'prop-types'
import { Component } from 'react'
import { getSocket, socketUrl } from 'client/websockets.mjs'
import { isEqual } from 'lodash'
import rollbar from 'client/rollbar'
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

  constructor (props) {
    super(props)
    this.handlers = {
      commentAdded: props.receiveComment,
      messageAdded: props.receiveMessage,
      newNotification: props.receiveNotification,
      newPost: props.receivePost,
      newThread: props.receiveThread,
      userTyping: this.userTypingHandler
    }
  }

  componentDidMount () {
    this.socket = getSocket()
    this.reconnect()
    Object.keys(this.handlers).forEach(socketEvent =>
      this.socket.on(socketEvent, this.handlers[socketEvent]))
  }

  componentWillUnmount () {
    this.socket.post(socketUrl('/noo/threads/unsubscribe'))
    Object.keys(this.handlers).forEach(socketEvent =>
      this.socket.off(socketEvent, this.handlers[socketEvent]))
  }

  render () {
    return null
  }

  reconnect = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('connecting SocketListener...')
    }

    this.socket.post(socketUrl('/noo/threads/subscribe'), (body, jwr) => {
      if (!isEqual(body, {})) {
        rollbar.error(`Failed to connect SocketListener: ${body}`)
      }
    })
  }

  userTypingHandler = ({ userId, userName, isTyping }) => {
    const { addUserTyping, clearUserTyping } = this.props
    isTyping ? addUserTyping(userId, userName) : clearUserTyping(userId)
  }
}
