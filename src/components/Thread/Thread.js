import React from 'react'
import { Link } from 'react-router-dom'
import { filter, get, map } from 'lodash/fp'
const { func, object, string } = React.PropTypes
import Icon from 'components/Icon'
import MessageSection from 'components/MessageSection'
import MessageForm from 'components/MessageForm'
import PeopleTyping from 'components/PeopleTyping'
import { socketUrl } from 'client/websockets'
import './Thread.scss'

export default class Thread extends React.Component {
  static propTypes = {
    threadId: string.isRequired,
    socket: object,
    currentUser: object,
    thread: object,
    fetchThread: func
  }

  setupForThread () {
    const { socket, threadId, fetchThread } = this.props
    fetchThread(threadId)
    socket.post(socketUrl(`/noo/post/${threadId}/subscribe`)) // for people typing
    if (this.reconnectHandler) {
      socket.off('reconnect', this.reconnectHandler)
    }
    this.reconnectHandler = () => {
      socket.post(socketUrl(`/noo/post/${threadId}/subscribe`))
    }
    socket.on('reconnect', this.reconnectHandler)
    this.refs.form.getWrappedInstance().focus()
  }

  componentDidMount () {
    this.setupForThread()
  }

  disableSocket () {
    const { socket, threadId } = this.props
    socket.off('reconnect', this.reconnectHandler)
    socket.post(socketUrl(`/noo/post/${threadId}/unsubscribe`))
  }

  componentWillReceiveProps (nextProps) {
    const oldId = get('threadId', this.props)
    const newId = get('threadId', nextProps)
    if (newId !== oldId) this.disableSocket()
  }

  componentDidUpdate (prevProps) {
    const oldId = get('threadId', prevProps)
    const newId = get('threadId', this.props)
    if (newId !== oldId && newId) this.setupForThread()
  }

  componentWillUnmount () {
    this.disableSocket()
  }

  render () {
    const { socket, threadId, thread, currentUser } = this.props
    return <div styleName='thread'>
      <Header thread={thread} currentUser={currentUser} />
      <MessageSection thread={thread} messageThreadId={threadId} socket={socket} />
      <div styleName='message-form-bg' />
      <div styleName='message-form'>
        <MessageForm messageThreadId={threadId} ref='form' socket={socket} />
      </div>
      <PeopleTyping styleName='people-typing' />
    </div>
  }
}

function Header ({ thread, currentUser }) {
  const participants = get('participants', thread) || []
  const id = get('id', currentUser)
  const others = map('name', filter(f => f.id !== id, participants))
  const othersMinusLast = others.slice(0, others.length - 1)

  return <div styleName='header' id='thread-header'>
    <div styleName='header-text'>
      You{others.length > 1 ? `, ${othersMinusLast.join(', ')}` : ''} and {others[others.length - 1]}
    </div>
    <Icon name='More' styleName='more-icon' />
    <Link to='/' styleName='close-messages'>
      <Icon name='Ex' styleName='close-messages-icon' />
    </Link>
  </div>
}
