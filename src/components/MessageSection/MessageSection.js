import React from 'react'
import visibility from 'visibility'
import { throttle, isEmpty } from 'lodash'
import { get, maxBy } from 'lodash/fp'
const { array, bool, func, object } = React.PropTypes
import cx from 'classnames'
import Message from 'components/Message'
import { position } from 'util/scrolling'
import './MessageSection.scss'

// the maximum amount of time in minutes that can pass between messages to still
// include them under the same avatar and timestamp
const MAX_MINS_TO_BATCH = 5

function createMessageList (messages) {
  let currentHeader
  return messages.map((m, index) => {
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
    return <Message message={m} key={`message-${m.id}`} isHeader={isHeader} />
  })
}

export default class MessageSection extends React.Component {
  static propTypes = {
    messages: array,
    onScroll: func,
    onScrollToTop: func,
    onHitBottom: func,
    onLeftBottom: func,
    pending: bool,
    thread: object,
    updateThreadReadTime: func,
    currentUser: object
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
    const { currentUser } = this.props
    const latestMessage = maxBy('createdAt', this.props.messages || [])
    const userSentLatest = get('creator.id', latestMessage) === currentUser.id
    const { scrolledUp } = this.state
    if (messagesLength !== oldMessagesLength && (!scrolledUp || userSentLatest)) this.scrollToBottom()
  }

  scrollToMessage (id) {
    const message = document.querySelector(`[data-message-id="${id}"]`)

    // the last portion of the offset varies because sometimes the message that
    // is first in the list before pagination won't have a header after the
    // pagination is done
    this.list.scrollTop = position(message, this.list).y -
      document.querySelector('#topNav').offsetHeight -
      document.querySelector('.thread .header').offsetHeight -
      (message.className.includes('messageHeader') ? 11 : 41)
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
    if (scrollTop <= 50 && this.props.onScrollToTop) this.props.onScrollToTop()
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
  }

  markAsRead = () => {
    const { thread, updateThreadReadTime } = this.props
    updateThreadReadTime(thread.id)
  }

  render () {
    const { messages } = this.props
    const messageList = createMessageList(messages)
    const sName = cx('messages-section', {empty: isEmpty(messages)})
    return <div styleName={sName}
      ref={list => { this.list = list }}
      onScroll={this.handleScroll}>
      <div styleName='messages-section-inner'>
        {messageList}
      </div>
    </div>
  }
}
