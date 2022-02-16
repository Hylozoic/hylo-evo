import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { get, isEmpty, orderBy } from 'lodash/fp'
import { Link } from 'react-router-dom'
import { TextHelpers } from 'hylo-shared'
import Badge from 'components/Badge'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import TextInput from 'components/TextInput'
import ScrollListener from 'components/ScrollListener'
import { toRefArray, itemsToArray } from 'util/reduxOrmMigration'
import { participantAttributes } from 'store/models/MessageThread'
import Loading from 'components/Loading'
import './ThreadList.scss'

export default class ThreadList extends Component {
  static defaultProps = {
    threads: []
  }

  onSearchChange = event => this.props.setThreadSearch(event.target.value)

  render () {
    const {
      currentUser,
      threadsPending,
      threads,
      threadSearch,
      onScrollBottom,
      match: { params: { messageThreadId } },
      className
    } = this.props

    return <div styleName='thread-list' className={className}>
      <div styleName='header'>
        <div styleName='search'>
          <div styleName='search-icon'>
            <Icon name='Search' />
          </div>
          <TextInput
            placeholder='Search for people...'
            value={threadSearch}
            onChange={this.onSearchChange}
            onFocus={this.props.onFocus}
            noClearButton
          />
        </div>
        <Link styleName='new-message' to='/messages/new'>
          <span>New</span>
          <Icon name='Messages' styleName='messages-icon' />
        </Link>
      </div>
      <ul styleName='list' id={'thread-list-list'}>
        {!isEmpty(threads) && threads.map(t => {
          const messages = itemsToArray(toRefArray(t.messages))
          const isUnread = t.unreadCount > 0
          const latestMessage = orderBy(m => Date.parse(m.createdAt), 'desc', messages)[0]

          return <ThreadListItem
            id={t.id}
            active={t.id === messageThreadId}
            thread={t}
            latestMessage={latestMessage}
            currentUser={currentUser}
            unreadCount={t.unreadCount}
            key={`thread-li-${t.id}`}
            isUnread={isUnread} />
        })}
        {threadsPending &&
          <Loading type='bottom' />}
        {!threadsPending && isEmpty(threads) && !threadSearch &&
          <div styleName='no-conversations'>You have no active messages</div>}
        {!threadsPending && isEmpty(threads) && threadSearch &&
          <div styleName='no-conversations'>No messages found</div>}
      </ul>
      <ScrollListener
        elementId={'thread-list-list'}
        onBottom={onScrollBottom} />
    </div>
  }
}

ThreadList.propTypes = {
  className: PropTypes.string,
  currentUser: PropTypes.object,
  onScrollBottom: PropTypes.func,
  match: PropTypes.object,
  setThreadSearch: PropTypes.func,
  threadSearch: PropTypes.string,
  threads: PropTypes.array,
  threadsPending: PropTypes.bool
}

export const MAX_THREAD_PREVIEW_LENGTH = 54

export function ThreadListItem ({
  currentUser, active, id, thread, latestMessage, unreadCount, isUnread
}) {
  const latestMessagePreview = latestMessage?.text
    ? TextHelpers.truncateText(TextHelpers.htmlToText(latestMessage.text), MAX_THREAD_PREVIEW_LENGTH)
    : ''
  const { names, avatarUrls } = participantAttributes(thread, currentUser, 2)

  return <li styleName={cx({ 'list-item': true, 'unread-list-item': isUnread, 'active': active })}>
    <Link to={`/messages/${id}`}>
      {active && <div styleName='active-thread' />}
      <ThreadAvatars avatarUrls={avatarUrls} />
      <div styleName='li-center-content'>
        <ThreadNames names={names} />
        <div styleName='thread-message-text' dangerouslySetInnerHTML={{ __html: latestMessagePreview }} />
      </div>
      <div styleName='li-right-content'>
        <div styleName='message-time'>{TextHelpers.humanDate(get('createdAt', latestMessage))}</div>
        {unreadCount > 0 && <Badge number={unreadCount} expanded />}
      </div>
    </Link>
  </li>
}

ThreadListItem.propTypes = {
  active: PropTypes.bool,
  currentUser: PropTypes.object,
  id: PropTypes.any,
  latestMessage: PropTypes.shape({
    text: PropTypes.string.isRequired
  }),
  onFocus: PropTypes.func,
  thread: PropTypes.object,
  unreadCount: PropTypes.number
}

function ThreadAvatars ({ avatarUrls }) {
  const count = avatarUrls.length
  const style = `avatar-${count < 4 ? count : 'more'}`
  const plusStyle = `avatar-${count < 4 ? count : 'more'} ${count > 4 ? 'plus-count' : ''}`
  return <div styleName='thread-avatars'>
    {(count === 1 || count === 2) && <RoundImage url={avatarUrls[0]} />}
    {count === 2 && <RoundImage url={avatarUrls[1]} medium styleName={style} />}
    {count > 2 && <RoundImage url={avatarUrls[0]} medium styleName={style} />}
    {count > 2 && <RoundImage url={avatarUrls[1]} medium styleName={style} />}
    {count > 2 && <RoundImage url={avatarUrls[2]} medium styleName={style} />}
    {count === 4 && <RoundImage url={avatarUrls[3]} medium styleName={style} />}
    {count > 4 && <div styleName={`${plusStyle}`}>+{count - 4}</div>}
  </div>
}

function ThreadNames ({ names }) {
  return <div styleName='thread-names'>
    {names}
  </div>
}
