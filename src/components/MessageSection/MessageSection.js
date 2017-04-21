import React from 'react'
import visibility from 'visibility'
import { throttle } from 'lodash'
import { get, maxBy } from 'lodash/fp'
const { array, bool, func, number, object, string } = React.PropTypes
import Message from 'components/Message'
import { position } from 'util/scrolling'
import './MessageSection.scss'

// the maximum amount of time in minutes that can pass between messages to still
// include them under the same avatar and timestamp
const MAX_MINS_TO_BATCH = 5

const lastSeenAtTimes = {}

function createMessageList (messages, lastSeenAt) {
  let currentHeader, lastTimestamp
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
    let messageTime = new Date(m.createdAt).getTime()
    if (lastTimestamp && lastSeenAt && lastTimestamp < lastSeenAt && lastSeenAt < messageTime) {
      acc.push(<div styleName='new-messages' key='new-messages'>
        <div styleName='new-messages-text'>new messages</div>
        <div styleName='new-messages-line' />
      </div>)
    }
    lastTimestamp = messageTime
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
    onScroll: func,
    onScrollToTop: func,
    onHitBottom: func,
    onLeftBottom: func,
    thread: object,
    updateThreadReadTime: func,
    fetchMessages: func
  }

  constructor (props) {
    super(props)
    this.state = {
      scrolledUp: false
    }
  }

  componentDidMount () {
    this.visibility = visibility()
    this.scrollToBottom()
  }

  componentDidUpdate (prevProps) {
    const messagesLength = this.props.messages.length
    const oldMessagesLength = prevProps.messages.length
    const { currentUser, thread } = this.props
    const latestMessage = maxBy('createdAt', this.props.messages || [])
    const userSentLatest = get('creator.id', latestMessage) === get('id', currentUser)
    const { scrolledUp } = this.state
    if (messagesLength !== oldMessagesLength && (!scrolledUp || userSentLatest)) this.scrollToBottom()
    if (thread && !lastSeenAtTimes[thread.id] && thread.unreadCount) {
      lastSeenAtTimes[thread.id] = new Date(thread.lastReadAt).getTime()
    }
  }

  fetchMore = () => {
    const { hasMore, pending, fetchMessages } = this.props
    if (hasMore && !pending) fetchMessages()
  }

  scrollToMessage (id) {
    const message = document.querySelector(`[data-message-id="${id}"]`)

    // FIXME: this won't work anymore
    // the last portion of the offset varies because sometimes the message that
    // is first in the list before pagination won't have a header after the
    // pagination is done
    const newtop = position(message, this.list)
    //console.log(newtop)
    this.list.scrollTop = newtop.y
  }

  detectScrollExtremes = throttle(target => {
    const { onLeftBottom, onHitBottom } = this.props
    const { scrolledUp } = this.state
    const { scrollTop, scrollHeight, offsetHeight } = target
    const onBottom = scrollTop > scrollHeight - offsetHeight
    if (!onBottom && !scrolledUp) {
      this.setState({ scrolledUp: true })
      onLeftBottom()
    } else if (onBottom && scrolledUp) {
      this.setState({ scrolledUp: false })
      this.markAsRead()
      onHitBottom()
    }
    if (scrollTop <= 50) this.fetchMore()
  }, 500, {trailing: true})

  handleScroll = event => {
    if (this.props.onScroll) this.props.onScroll(event)
    this.detectScrollExtremes(event.target)
  }

  scrollToBottom = () => {
    this.list.scrollTop = this.list.scrollHeight
    if (this.visibility.visible()) {
      this.markAsRead()
    } else {
      this.visibility.once('show', this.markAsRead)
    }
    this.props.onHitBottom()
    this.setState({ scrolledUp: false })
  }

  markAsRead = () => {
    const { thread, updateThreadReadTime } = this.props
    if (thread) updateThreadReadTime(thread.id)
  }

  render () {
    const { messages, thread } = this.props

    /*
    const { messages, fetchAfterMessages } = this.props
    const afterId = max(map('id', messages))
    fetchAfterMessages(afterId)
    .then(() => this.refs.messageSection.getWrappedInstance().scrollToBottom())

    const loadMore = () => {
      if (pending || messages.length >= thread.messagesTotal) return
      const beforeId = min(map('id', messages))
      fetchBeforeMessages(thread.id, beforeId)
      .then(() => this.refs.messageSection.getWrappedInstance().scrollToMessage(beforeId))
    }
    */
    return <div styleName='messages-section'
      ref={list => { this.list = list }}
      onScroll={this.handleScroll}>
      <div styleName='messages-section-inner'>
        {createMessageList(messages, lastSeenAtTimes[get('id', thread)])}
      </div>
    </div>
  }
}
