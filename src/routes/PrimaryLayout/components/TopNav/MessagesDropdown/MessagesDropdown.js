import React, { Component } from 'react'
import { array, string, func } from 'prop-types'
import { get, isEmpty, some, find, orderBy } from 'lodash/fp'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { humanDate, textLength, truncate } from 'hylo-utils/text'
import { toRefArray, itemsToArray } from 'store/models'
import { newMessageUrl, threadUrl } from 'util/navigation'
import RoundImageRow from 'components/RoundImageRow'
import TopNavDropdown from '../TopNavDropdown'
import { participantAttributes, isUnread, isUpdatedSince } from 'store/models/MessageThread'
import NoItems from 'routes/PrimaryLayout/components/TopNav/NoItems'
import LoadingItems from 'routes/PrimaryLayout/components/TopNav/LoadingItems'
import './MessagesDropdown.scss'

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

  componentDidMount = () => {
    const { fetchThreads } = this.props
    if (fetchThreads) fetchThreads()
  }

  onToggle = nowActive => {
    // TODO this is not quite sufficient -- this value should also be bumped
    // if the current user is in the messages UI, receiving new messages.
    if (nowActive) this.setState({ lastOpenedAt: new Date() })
  }

  hasUnread () {
    if (isEmpty(this.props.threads)) {
      const { currentUser } = this.props
      return currentUser && currentUser.unseenThreadCount > 0
    }

    const { lastOpenedAt } = this.state

    return some(
      thread => isUnread(thread) && (!lastOpenedAt || isUpdatedSince(thread, lastOpenedAt)),
      this.props.threads
    )
  }

  render () {
    const {
      renderToggleChildren,
      threads,
      className,
      goToThread,
      currentUser,
      pending
    } = this.props

    const onClick = id => {
      goToThread(id)
      this.refs.dropdown.toggle(false)
    }

    let body
    if (pending) {
      body = <LoadingItems />
    } else if (isEmpty(threads)) {
      body = <NoItems message="You don't have any conversations yet" />
    } else {
      body = <div styleName='threads'>
        {threads.map(thread => <MessagesDropdownItem
          thread={thread}
          onClick={() => onClick(thread.id)}
          currentUser={currentUser}
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

export function MessagesDropdownItem ({ thread, onClick, currentUser }) {
  const message = orderBy(m => Date.parse(m.createdAt), 'desc', toRefArray(itemsToArray(thread.messages)))[0]
  if (!message || !message.text) return null

  var { text } = message
  var participants = toRefArray(thread.participants)
  text = lastMessageCreator(message, currentUser, participants) + text

  const { names, avatarUrls } = participantAttributes(thread, currentUser, 2)

  const maxMessageLength = 145

  if (textLength(text) > maxMessageLength) {
    text = `${truncate(text, maxMessageLength)}...`
  }

  return <li styleName={cx('thread', { unread: isUnread(thread) })}
    onClick={onClick}>
    <div styleName='image-wrapper'>
      <RoundImageRow imageUrls={avatarUrls} vertical ascending cap='2' />
    </div>
    <div styleName='message-content'>
      <div styleName='name'>{names}</div>
      <div styleName='body'>{text}</div>
      <div styleName='date'>{humanDate(thread.updatedAt)}</div>
    </div>
  </li>
}

export function lastMessageCreator (message, currentUser, participants) {
  if (get('id', message.creator) === currentUser.id) return 'You: '
  if (participants.length <= 2) return ''
  return find(p => p.id === get('creator', message), participants).name + ': '
}
