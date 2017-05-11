import React, { PropTypes, Component } from 'react'
import './NotificationsDropdown.scss'
const { object, array, string, func } = PropTypes
import { humanDate, textLength, truncate } from 'hylo-utils/text'
import cx from 'classnames'
import RoundImageRow from 'components/RoundImageRow'
import TopNavDropdown from '../TopNavDropdown'

export default class NotificationsDropdown extends Component {
  static propTypes = {
    fetchThreads: func,
    toggleChildren: object,
    threads: array,
    className: string,
    goToThread: func
  }

  constructor (props) {
    super(props)
    this.state = {
      showingUnread: false
    }
  }

  componentDidMount () {
    this.props.fetchThreads()
  }

  render () {
    const {
      toggleChildren, threads, className, goToThread, currentUser, markAsRead
    } = this.props
    const { showingUnread } = this.state

    const showRecent = () => this.setState({showingUnread: false})
    const showUnread = () => this.setState({showingUnread: true})

    return <TopNavDropdown
      className={className}
      toggleChildren={toggleChildren}
      header={
        <div styleName='header-content'>
          <span onClick={showRecent} styleName={cx('tab', {active: !showingUnread})}>
            Recent
          </span>
          <span onClick={showUnread} styleName={cx('tab', {active: showingUnread})}>
            Unread
          </span>
          <span onClick={markAsRead} styleName='mark-read'>Mark all as read</span>
        </div>}
      body={
        <div styleName='threads'>
          {threads.map(thread => <Thread
            thread={thread}
            goToThread={goToThread}
            currentUserId={currentUser.id}
            key={thread.id} />)}
        </div>
      } />
  }
}

const participantNames = participants => {
  const length = participants.length
  if (length === 1) {
    return participants[0].name
  } else if (length === 2) {
    return `${participants[0].name} and ${participants[1].name}`
  } else if (length > 2) {
    const n = length - 2
    return `${participants[0].name}, ${participants[1].name} and ${n} other${n > 1 ? 's' : ''}`
  }
}

export function Thread ({ thread, goToThread, currentUserId }) {
  const message = thread.messages[0]
  if (!message || !message.text) return null
  const participants = thread.participants.filter(p => p.id !== currentUserId)

  const unread = thread.lastReadAt < thread.updatedAt

  var { text } = message
  if (message.creator.id === currentUserId) {
    text = `You: ${text}`
  }

  const maxMessageLength = 145

  if (textLength(text) > maxMessageLength) {
    text = `${truncate(text, maxMessageLength)}...`
  }

  return <li styleName={cx('thread', {unread})}
    onClick={goToThread(thread.id)}>
    <div styleName='image-wraper'>
      <RoundImageRow imageUrls={participants.map(p => p.avatarUrl)} vertical ascending cap='2' />
    </div>
    <div styleName='message-content'>
      <div styleName='name'>{participantNames(participants)}</div>
      <div styleName='body'>{text}</div>
      <div styleName='date'>{humanDate(thread.updatedAt)}</div>
    </div>
  </li>
}
