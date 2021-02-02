import { array, bool, func, object } from 'prop-types'
import React from 'react'
import { throttle, debounce } from 'lodash'
import { get } from 'lodash/fp'
import Loading from 'components/Loading'
import Message from '../Message'
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
    acc.push(<Message message={m} key={`message-${m.id}`} isHeader={isHeader} />)
    return acc
  }, [])
}

export default class MessageSection extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: true,
      onNextVisible: null
    }
    this.list = React.createRef()
  }

  componentDidMount () {
    const { socket, fetchMessages } = this.props
    this.scrollToBottom()
    this.reconnectHandler = () => fetchMessages()
    socket && socket.on('reconnect', this.reconnectHandler)
    document && document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  componentWillUnmount () {
    const { socket } = this.props
    socket && socket.off('reconnect', this.reconnectHandler)
    document && document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate (nextProps) {
    const { currentUser, messages, pending } = nextProps
    if (pending) return

    const oldMessages = this.props.messages
    const deltaLength = Math.abs(messages.length - oldMessages.length)

    // Note: we write directly to the object here rather than using setState.
    // This avoids an automatic re-render on scroll, and any inconsistencies
    // owing to the async nature of setState and/or setState batching.

    this.shouldScroll = false

    if (deltaLength) {
      const latest = messages[messages.length - 1]
      const oldLatest = oldMessages[oldMessages.length - 1]

      // Are additional messages old (at the beginning of the sorted array)?
      if (this.props.hasMore && get('id', latest) === get('id', oldLatest)) return

      // If there's one new message, it's not from currentUser,
      // and we're not already at the bottom, don't scroll
      if (deltaLength === 1 &&
        get('creator.id', latest) !== get('id', currentUser) &&
        !this.atBottom(this.list.current)) return

      this.shouldScroll = true
    }
  }

  componentDidUpdate (prevProps) {
    if (this.shouldScroll) this.scrollToBottom()
  }

  atBottom = ({ offsetHeight, scrollHeight, scrollTop }) =>
    scrollHeight - scrollTop - offsetHeight < 1

  handleVisibilityChange = () => {
    const { onNextVisible } = this.state

    if (document && document.hidden) {
      this.setState({ visible: false })
    } else {
      if (onNextVisible) onNextVisible()
      this.setState({ visible: true, onNextVisible: null })
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
    // Marks entire thread as read if we've seen the last message
    if (this.atBottom(target)) this.markAsRead()
    if (target.scrollTop <= 150) this.fetchMore()
  }, 500, { trailing: true })

  handleScroll = event => {
    this.detectScrollExtremes(event.target)
  }

  scrollToBottom = () => {
    this.list.current.scrollTop = this.list.current.scrollHeight
    if (this.state.visible) {
      this.markAsRead()
    } else {
      this.setState({ onNextVisible: this.markAsRead })
    }
  }

  markAsRead = debounce(() => {
    const { messageThread, updateThreadReadTime } = this.props
    if (messageThread) updateThreadReadTime(messageThread.id)
  }, 2000)

  render () {
    const { messages, pending, messageThread } = this.props

    return <div styleName='messages-section'
      ref={this.list}
      onScroll={this.handleScroll}>
      {pending && <Loading />}
      {!pending &&
        <div styleName='messages-section-inner'>
          {createMessageList(messages, lastSeenAtTimes[get('id', messageThread)])}
        </div>
      }
    </div>
  }
}

MessageSection.propTypes = {
  fetchMessages: func.isRequired,
  hasMore: bool,
  messageThread: object,
  messages: array,
  pending: bool,
  socket: object,
  currentUser: object,
  updateThreadReadTime: func
}
