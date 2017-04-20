import React from 'react'
import { Link } from 'react-router-dom'
import { filter, get, map, min, max, sortBy } from 'lodash/fp'
const { array, bool, func, object, string } = React.PropTypes
import Icon from 'components/Icon'
import MessageSection from 'components/MessageSection'
import MessageForm from 'components/MessageForm'
import PeopleTyping from 'components/PeopleTyping'
import { getSocket, socketUrl } from 'client/websockets'
import './Thread.scss'

export default class Thread extends React.Component {
  static propTypes = {
    threadId: string.isRequired,
    currentUser: object,
    thread: object,
    messages: array,
    pending: bool,
    fetchThread: func,
    onThreadPage: func,
    offThreadPage: func,
    fetchBeforeMessages: func,
    fetchAfterMessages: func
  }

  constructor (props) {
    super(props)
    this.state = {scrolledUp: false}
  }

  setupForThread () {
    const { threadId, fetchThread, onThreadPage } = this.props
    fetchThread(threadId)
    onThreadPage(threadId)
    if (this.socket) {
      this.socket.post(socketUrl(`/noo/post/${threadId}/subscribe`)) // for people typing

      if (this.reconnectHandler) {
        this.socket.off('reconnect', this.reconnectHandler)
      }

      this.reconnectHandler = () => {
        const { messages, fetchAfterMessages } = this.props
        const afterId = max(map('id', messages))
        fetchAfterMessages(afterId)
        .then(() => this.refs.messageSection.getWrappedInstance().scrollToBottom())
        this.socket.post(socketUrl(`/noo/post/${threadId}/subscribe`))
      }
      this.socket.on('reconnect', this.reconnectHandler)
    }

    this.refs.form.getWrappedInstance().focus()
  }

  componentDidMount () {
    this.socket = getSocket()
    this.setupForThread()
  }

  disableSocket () {
    if (this.socket) {
      this.socket.off('reconnect', this.reconnectHandler)
      this.socket.post(socketUrl(`/noo/post/${this.props.threadId}/unsubscribe`))
    }
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
    const { offThreadPage } = this.props
    offThreadPage()
    this.disableSocket()
  }

  render () {
    const { threadId, thread, pending, fetchBeforeMessages, currentUser } = this.props
    const lastReadAt = get('lastReadAt', thread)
    const messages = get('messages', thread) || []
    const loadMore = () => {
      if (pending || messages.length >= thread.messagesTotal) return
      const beforeId = min(map('id', messages))
      fetchBeforeMessages(thread.id, beforeId)
      .then(() => this.refs.messageSection.getWrappedInstance().scrollToMessage(beforeId))
    }
    return <div styleName='thread'>
      <Header thread={thread} currentUser={currentUser} />
      <MessageSection messages={messages} thread={thread}
        lastReadAt={lastReadAt}
        onLeftBottom={() => this.setState({scrolledUp: true})}
        onHitBottom={() => this.setState({scrolledUp: false})}
        onScrollToTop={loadMore} ref='messageSection' />
      <div styleName='message-form-bg' />
      <div styleName='message-form'>
        <MessageForm messageThreadId={threadId} ref='form' />
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
