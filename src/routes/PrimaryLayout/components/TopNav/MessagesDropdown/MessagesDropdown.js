import React, { PropTypes, Component } from 'react'
import './MessagesDropdown.scss'
const {array, string, func} = PropTypes
import { Link } from 'react-router-dom'
import { humanDate, textLength, truncate } from 'hylo-utils/text'
import cx from 'classnames'
import { newMessageUrl, threadUrl, bgImageStyle } from 'util/index'
import RoundImageRow from 'components/RoundImageRow'
import TopNavDropdown from '../TopNavDropdown'
import { get, isEmpty, some } from 'lodash/fp'

export default class MessagesDropdown extends Component {
  static propTypes = {
    fetchThreads: func,
    renderToggleChildren: func,
    threads: array,
    className: string,
    goToThread: func
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  onToggle = nowActive => {
    // TODO this is not quite sufficient -- this value should also be bumped
    // if the current user is in the messages UI, receiving new messages.
    if (nowActive) this.setState({lastOpenedAt: new Date()})
  }

  hasUnread () {
    if (isEmpty(this.props.threads)) {
      const { currentUser } = this.props
      return currentUser && currentUser.unseenThreadCount > 0
    }

    const { lastOpenedAt } = this.state
    const isUnread = t =>
      t.isUnread() && (!lastOpenedAt || t.isUpdatedSince(lastOpenedAt))
    return some(isUnread, this.props.threads)
  }

  render () {
    const {
      renderToggleChildren,
      threads,
      className,
      goToThread,
      currentUser,
      fetchThreads,
      pending
    } = this.props

    const onClick = id => {
      goToThread(id)
      this.refs.dropdown.getWrappedInstance().toggle(false)
    }

    let body
    if (pending) {
      body = <Loader />
    } else if (isEmpty(threads)) {
      body = <NoMessages />
    } else {
      body = <div styleName='threads'>
        {threads.map(thread => <MessagesDropdownItem
          thread={thread}
          onClick={() => onClick(thread.id)}
          currentUserId={get('id', currentUser)}
          key={thread.id} />)}
      </div>
    }

    const firstThreadUrl = !isEmpty(threads)
      ? threadUrl(threads[0].id)
      : newMessageUrl()

    return <TopNavDropdown
      ref='dropdown'
      className={className}
      onToggle={this.onToggle}
      toggleChildren={renderToggleChildren(this.hasUnread())}
      onFirstOpen={fetchThreads}
      header={
        <div styleName='header-content'>
          <Link to={firstThreadUrl} styleName='open'>
            Open Messages
          </Link>
          <Link to={newMessageUrl()} styleName='new'>New</Link>
        </div>}
      body={body}
    />
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

export function MessagesDropdownItem ({ thread, onClick, currentUserId }) {
  const message = thread.messages.orderBy(m => Date.parse(m.createdAt), 'desc').first()
  if (!message || !message.text) return null
  const participants = thread.participants.toRefArray()
  .filter(p => p.id !== currentUserId)

  var { text } = message
  if (message.creator.id === currentUserId) {
    text = `You: ${text}`
  }

  const maxMessageLength = 145

  if (textLength(text) > maxMessageLength) {
    text = `${truncate(text, maxMessageLength)}...`
  }

  return <li styleName={cx('thread', {unread: thread.isUnread()})}
    onClick={onClick}>
    <div styleName='image-wrapper'>
      <RoundImageRow imageUrls={participants.map(p => p.avatarUrl)} vertical ascending cap='2' />
    </div>
    <div styleName='message-content'>
      <div styleName='name'>{participantNames(participants)}</div>
      <div styleName='body'>{text}</div>
      <div styleName='date'>{humanDate(thread.updatedAt)}</div>
    </div>
  </li>
}

function NoMessages () {
  return (
    <div styleName='no-messages'>
      <h3>You don't have any conversations yet</h3>
      <div styleName='image' style={bgImageStyle('/assets/hey-axolotl.png')} />
    </div>
  )
}

function Loader () {
  return (
    <div styleName='loader'>
      <div styleName='loader-image'
        style={bgImageStyle('/assets/thinking-axolotl.png')} />
      <div styleName='loader-animation'>
        <svg version='1.1' viewBox='0 0 100 100' enableBackground='new 0 0 0 0'>
          <circle fill='#BBB' stroke='none' cx='6' cy='6' r='6'>
            <animate
              attributeName='opacity'
              dur='1s'
              values='0;1;0'
              repeatCount='indefinite'
              begin='0.1' />
          </circle>
          <circle fill='#BBB' stroke='none' cx='26' cy='6' r='6'>
            <animate
              attributeName='opacity'
              dur='1s'
              values='0;1;0'
              repeatCount='indefinite'
              begin='0.2' />
          </circle>
          <circle fill='#BBB' stroke='none' cx='46' cy='6' r='6'>
            <animate
              attributeName='opacity'
              dur='1s'
              values='0;1;0'
              repeatCount='indefinite'
              begin='0.3' />
          </circle>
        </svg>
      </div>
    </div>
  )
}
