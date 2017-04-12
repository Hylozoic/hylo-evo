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
    id: string,
    currentUser: object,
    thread: object,
    messages: array,
    pending: bool,
    onThreadPage: func,
    offThreadPage: func,
    fetchBefore: func,
    fetchAfter: func
  }

  constructor (props) {
    super(props)
    this.state = {scrolledUp: false}
  }

  setupForThread () {
    return
    const { thread: { id }, onThreadPage } = this.props
    //onThreadPage()
    if (this.socket) {
      this.socket.post(socketUrl(`/noo/post/${id}/subscribe`)) // for people typing

      if (this.reconnectHandler) {
        this.socket.off('reconnect', this.reconnectHandler)
      }

      this.reconnectHandler = () => {
        const { messages, fetchAfter } = this.props
        const afterId = max(map('id', messages))
        fetchAfter(afterId)
        .then(() => this.refs.messageSection.scrollToBottom())
        this.socket.post(socketUrl(`/noo/post/${id}/subscribe`))
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
    const threadId = get('thread.id', this.props)
    if (this.socket) {
      this.socket.off('reconnect', this.reconnectHandler)
      this.socket.post(socketUrl(`/noo/post/${threadId}/unsubscribe`))
    }
  }

  componentWillReceiveProps (nextProps) {
    const oldId = get('thread.id', this.props)
    const newId = get('thread.id', nextProps)
    if (newId !== oldId) this.disableSocket()
  }

  componentDidUpdate (prevProps) {
    const oldId = get('thread.id', prevProps)
    const newId = get('thread.id', this.props)
    if (newId !== oldId && newId) this.setupForThread()
  }

  componentWillUnmount () {
    const { offThreadPage } = this.props
    //offThreadPage()
    this.disableSocket()
  }

  render () {
    const { thread, pending, fetchBefore, currentUser } = this.props
    const { scrolledUp } = this.state
    /*const loadMore = () => {
      if (pending || messages.length >= thread.messagesTotal) return
      const beforeId = min(map('id', messages))
      fetchBefore(beforeId)
      .then(() => this.refs.messageSection.scrollToMessage(beforeId))
    }*/
    const loadMore = () => {}
    const messages = sortBy('createdAt', this.props.messages || [])
    return <div styleName='thread'>
      <Header thread={thread} currentUser={currentUser} />
      <MessageSection {...{messages, pending}} thread={thread}
        onLeftBottom={() => this.setState({scrolledUp: true})}
        onHitBottom={() => this.setState({scrolledUp: false})}
        onScrollToTop={loadMore} ref='messageSection' />
      <div styleName='message-form'>
        <MessageForm threadId={thread.id} ref='form' />
      </div>
      <PeopleTyping showNames showBorder={scrolledUp} />
    </div>
  }
}

function hasNewMessages (messages, thread, currentUser) {
  const latestMessage = messages.length && messages[messages.length - 1]
  const latestFromOther = latestMessage && latestMessage.creator.id !== currentUser.id
  return latestFromOther && thread.lastReadAt &&
    new Date(latestMessage.createdAt) > new Date(thread.lastReadAt)
}

function Header ({ thread, currentUser }) {
  const participants = thread.participants
  const id = get('id', currentUser)
  const others = map('name', filter(f => f.id !== id, participants))
  const othersMinusLast = others.slice(0, others.length - 1)

  return <div styleName='header'>
    <div styleName='header-text'>
      You{others.length > 1 ? `, ${othersMinusLast.join(', ')}` : ''} and {others[others.length - 1]}
    </div>
    <Icon name='More' styleName='more-icon' />
    <Link to='/' styleName='close-messages'>
      <Icon name='Ex' styleName='close-messages-icon' />
    </Link>
  </div>
}
