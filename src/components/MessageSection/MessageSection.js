import React from 'react'
import { throttle } from 'lodash'
import { get } from 'lodash/fp'
const { array, bool, func, number, object, string } = React.PropTypes
import Message from 'components/Message'
import './MessageSection.scss'

// the maximum amount of time in minutes that can pass between messages to still
// include them under the same avatar and timestamp
const MAX_MINS_TO_BATCH = 5

const lastSeenAtTimes = {}

export function createMessageList (messages, lastSeenAt) {
  let currentHeader
  return messages.reduce((acc, m) => {
    let headerDate, messageDate, diff, greaterThanMax
    let isHeader = false
    if (!currentHeader) {
      isHeader = true
      currentHeader = m
    } else {
      headerDate = new Date(currentHeader.createdAt)
      messageDate = new Date(m.createdAt)
      diff = Math.abs(headerDate - messageDate)
      greaterThanMax = Math.floor(diff / 60000) > MAX_MINS_TO_BATCH
      isHeader = greaterThanMax || m.creator.id !== currentHeader.creator.id
      currentHeader = isHeader ? m : currentHeader
    }
    /* on hold
    let messageTime = new Date(m.createdAt).getTime()
    if (lastTimestamp && lastSeenAt && lastTimestamp < lastSeenAt && lastSeenAt < messageTime) {
      acc.push(<NewMessages />)
    }
    lastTimestamp = messageTime */
    acc.push(<Message message={m} key={`message-${m.id}`} isHeader={isHeader} />)
    return acc
  }, [])
}

export default class MessageSection extends React.Component {
  static propTypes = {
    currentUser: object,
    messageThreadId: string,
    messages: array,
    pending: bool,
    total: number,
    hasMore: bool,
    thread: object,
    socket: object,
    updateThreadReadTime: func,
    fetchMessages: func,
    reconnectFetchMessages: func
  }

  constructor (props) {
    super(props)
    this.state = {
      visible: true,
      onNextVisible: null
    }
  }

  componentDidMount () {
    const { socket, reconnectFetchMessages } = this.props
    this.scrollToBottom()
    this.reconnectHandler = () => {
      reconnectFetchMessages()
    }
    socket.on('reconnect', this.reconnectHandler)
    document && document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  componentWillUnmount () {
    const { socket } = this.props
    socket.off('reconnect', this.reconnectHandler)
    document && document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }

  componentWillUpdate (prevProps) {
    const { currentUser, messages, pending } = this.props
    if (pending) return

    const oldMessages = prevProps.messages
    const deltaLength = Math.abs(messages.length - oldMessages.length)
    this.shouldScroll = false

    if (deltaLength) {
      const latest = messages[messages.length - 1]
      const oldLatest = oldMessages[oldMessages.length - 1]

      // Are additional messages new (at the end of the sorted array)?
      if (get('id', latest) !== get('id', oldLatest)) {
        // If there's one new message and it's not from currentUser, don't scroll
        if (deltaLength === 1 && get('creator.id', latest) !== currentUser.id) return
        this.shouldScroll = true
      }
    }
  }

  componentDidUpdate (prevProps) {
    if (this.shouldScroll) this.scrollToBottom()
    /* on hold
    if (thread && !lastSeenAtTimes[thread.id] && thread.unreadCount) {
      lastSeenAtTimes[thread.id] = new Date(thread.lastReadAt).getTime()
    } */
  }

  handleVisibilityChange = () => {
    const { onNextVisible } = this.state
    if (document && document.hidden) {
      this.setState({visible: false})
    } else {
      if (onNextVisible) onNextVisible()
      this.setState({visible: true, onNextVisible: null})
    }
  }

  fetchMore = () => {
    if (this.props.pending) return
    const { hasMore, fetchMessages, messages } = this.props
    const cursor = get('id', messages[0])
    if (cursor && hasMore) {
      fetchMessages()
    }
  }

  detectScrollExtremes = throttle(target => {
    if (this.props.pending) return
    const { scrollTop, scrollHeight, offsetHeight } = target

    if (scrollTop < scrollHeight - offsetHeight) this.markAsRead()
    if (scrollTop <= 150) this.fetchMore()
  }, 500, {trailing: true})

  handleScroll = event => {
    this.detectScrollExtremes(event.target)
  }

  scrollToBottom = () => {
    this.list.scrollTop = this.list.scrollHeight
    if (this.state.visible) {
      this.markAsRead()
    } else {
      this.setState({ onNextVisible: this.markAsRead })
    }
  }

  markAsRead = () => {
    const { thread, updateThreadReadTime } = this.props
    if (thread) updateThreadReadTime(thread.id)
  }

  render () {
    const { messages, pending, thread } = this.props
    return <div styleName='messages-section'
      ref={list => this.list = list} // eslint-disable-line no-return-assign
      onScroll={this.handleScroll}>
      <div styleName='messages-section-inner'>
        {pending && <div>TODO: Loading...</div>}
        {createMessageList(messages, lastSeenAtTimes[get('id', thread)])}
      </div>
    </div>
  }
}

/* on hold
function NewMessages () {
  return <div styleName='new-messages' key='new-messages'>
    <div styleName='new-messages-text'>new messages</div>
    <div styleName='new-messages-line' />
  </div>
} */
