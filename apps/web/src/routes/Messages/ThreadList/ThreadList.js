import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
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
import classes from './ThreadList.module.scss'

class ThreadList extends Component {
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
      className,
      t
    } = this.props

    return <div className={cx(classes.threadList, className)}>
      <div className={classes.header}>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <Icon name='Search' />
          </div>
          <TextInput
            placeholder={t('Search for people...')}
            value={threadSearch}
            onChange={this.onSearchChange}
            onFocus={this.props.onFocus}
            noClearButton
          />
        </div>
        <Link className={classes.newMessage} to='/messages/new'>
          <span>{t('New')}</span>
          <Icon name='Messages' className={classes.messagesIcon} />
        </Link>
      </div>
      <ul className={classes.list} id={'thread-list-list'}>
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
          <div className={classes.noConversations}>{t('You have no active messages')}</div>}
        {!threadsPending && isEmpty(threads) && threadSearch &&
          <div className={classes.noConversations}>{t('No messages found')}</div>}
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

export const MAX_THREAD_PREVIEW_LENGTH = 70

export function ThreadListItem ({
  currentUser, active, id, thread, latestMessage, unreadCount, isUnread
}) {
  const latestMessagePreview = TextHelpers.presentHTMLToText(latestMessage?.text, { truncate: MAX_THREAD_PREVIEW_LENGTH })
  const { names, avatarUrls } = participantAttributes(thread, currentUser, 2)

  return <li className={cx(classes.listItem, { [classes.unreadListItem]: isUnread, [classes.active]: active })}>
    <Link to={`/messages/${id}`}>
      {active && <div className={classes.activeThread} />}
      <ThreadAvatars avatarUrls={avatarUrls} />
      <div className={classes.liCenterContent}>
        <ThreadNames names={names} />
        <div className={classes.threadMessageText}>{latestMessagePreview}</div>
      </div>
      <div className={classes.liRightContent}>
        <div className={classes.messageTime}>{TextHelpers.humanDate(get('createdAt', latestMessage))}</div>
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
  const style = `avatar${count < 4 ? count : 'More'}`
  const plusStyle = cx(`avatar${count < 4 ? count : 'More'}`, { [classes.plusCount]: count > 4 })
  return <div className={classes.threadAvatars}>
    {(count === 1 || count === 2) && <RoundImage url={avatarUrls[0]} />}
    {count === 2 && <RoundImage url={avatarUrls[1]} medium className={classes[style]} />}
    {count > 2 && <RoundImage url={avatarUrls[0]} medium className={classes[style]} />}
    {count > 2 && <RoundImage url={avatarUrls[1]} medium className={classes[style]} />}
    {count > 2 && <RoundImage url={avatarUrls[2]} medium className={classes[style]} />}
    {count === 4 && <RoundImage url={avatarUrls[3]} medium className={classes[style]} />}
    {count > 4 && <div className={plusStyle}>+{count - 4}</div>}
  </div>
}

function ThreadNames ({ names }) {
  return <div className={classes.threadNames}>
    {names}
  </div>
}

export default withTranslation()(ThreadList)
