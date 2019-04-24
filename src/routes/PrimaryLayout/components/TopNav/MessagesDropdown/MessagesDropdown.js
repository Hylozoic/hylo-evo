import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './MessagesDropdown.scss'
import { Link } from 'react-router-dom'
import { humanDate, textLength, truncate } from 'hylo-utils/text'
import cx from 'classnames'
import { newMessageUrl, threadUrl } from 'util/navigation'
import RoundImageRow from 'components/RoundImageRow'
import TopNavDropdown from '../TopNavDropdown'
import { get, isEmpty, some, find } from 'lodash/fp'

import NoItems from 'routes/PrimaryLayout/components/TopNav/NoItems'
import LoadingItems from 'routes/PrimaryLayout/components/TopNav/LoadingItems'

const { array, string, func } = PropTypes

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
    fetchThreads()
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
  const message = thread.messages.orderBy(m => Date.parse(m.createdAt), 'desc').first()
  if (!message || !message.text) return null

  var { text } = message
  var participants = thread.participants.toRefArray()
  text = lastMessageCreator(message, currentUser, participants) + text

  const { names, avatarUrls } = thread.participantAttributes(currentUser, 2)

  const maxMessageLength = 145

  if (textLength(text) > maxMessageLength) {
    text = `${truncate(text, maxMessageLength)}...`
  }

  return <li styleName={cx('thread', { unread: thread.isUnread() })}
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
  return find(p => p.id === get('id', message.creator), participants).name + ': '
}
