import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './NotificationsDropdown.scss'
import { humanDate, textLength, truncate } from 'hylo-utils/text'
import cx from 'classnames'
import RoundImage from 'components/RoundImage'
import { firstName } from 'store/models/Person'
import TopNavDropdown from '../TopNavDropdown'
import { find, isEmpty, some } from 'lodash/fp'
import {
  ACTION_NEW_COMMENT,
  ACTION_TAG,
  ACTION_JOIN_REQUEST,
  ACTION_APPROVED_JOIN_REQUEST,
  ACTION_MENTION,
  ACTION_COMMENT_MENTION
} from 'store/models/Notification'
import striptags from 'striptags'
import { decode } from 'ent'
import NoItems from 'routes/PrimaryLayout/components/TopNav/NoItems'
import LoadingItems from 'routes/PrimaryLayout/components/TopNav/LoadingItems'

const { array, string, func } = PropTypes

export default class NotificationsDropdown extends Component {
  static propTypes = {
    fetchThreads: func,
    markActivityRead: func,
    markAllActivitiesRead: func,
    renderToggleChildren: func,
    notifications: array,
    className: string
  }

  constructor (props) {
    super(props)
    this.state = {
      showingUnread: false
    }
  }

  onToggle = nowActive => {
    if (nowActive) this.setState({lastOpenedAt: new Date()})
  }

  componentDidMount = () => {
    const { fetchNotifications } = this.props
    fetchNotifications()
  }

  hasUnread () {
    if (isEmpty(this.props.notifications)) {
      const { currentUser } = this.props
      return currentUser && currentUser.newNotificationCount > 0
    }

    const { lastOpenedAt } = this.state
    const isUnread = n =>
      n.activity && n.activity.unread && (!lastOpenedAt || new Date(n.createdAt) > lastOpenedAt)

    return some(isUnread, this.props.notifications)
  }

  render () {
    const {
      renderToggleChildren,
      className,
      goToNotification,
      markActivityRead,
      markAllActivitiesRead,
      pending
    } = this.props
    var { notifications } = this.props
    const { showingUnread } = this.state

    const showRecent = () => this.setState({showingUnread: false})
    const showUnread = () => this.setState({showingUnread: true})

    if (showingUnread) {
      notifications = notifications.filter(n => n.activity.unread)
    }

    const message = `No ${showingUnread ? 'unread ' : ''}notifications`

    const onClick = notification => {
      if (notification.activity.unread) markActivityRead(notification.activity.id)
      goToNotification(notification)
      this.refs.dropdown.toggle(false)
    }

    let body
    if (pending) {
      body = <LoadingItems />
    } else if (isEmpty(notifications)) {
      body = <NoItems message={message} />
    } else {
      body = <div styleName='notifications'>
        {notifications.map(notification => <Notification
          notification={notification}
          onClick={onClick}
          key={notification.id} />)}
      </div>
    }

    return <TopNavDropdown ref='dropdown'
      className={className}
      onToggle={this.onToggle}
      toggleChildren={renderToggleChildren(this.hasUnread())}
      header={
        <div styleName='header-content'>
          <span onClick={showRecent} styleName={cx('tab', {active: !showingUnread})}>
            Recent
          </span>
          <span onClick={showUnread} styleName={cx('tab', {active: showingUnread})}>
            Unread
          </span>
          <span onClick={markAllActivitiesRead} styleName='mark-read'>Mark all as read</span>
        </div>}
      body={body}
    />
  }
}

export function Notification ({ notification, onClick }) {
  const { activity: { unread, actor } } = notification

  return <li styleName={cx('notification', {unread})}
    onClick={() => onClick(notification)}>
    <div styleName='image-wraper'>
      <RoundImage url={actor.avatarUrl} />
    </div>
    <div styleName='content'>
      <NotificationHeader notification={notification} />
      <NotificationBody notification={notification} />
      <div styleName='date'>{humanDate(notification.createdAt)}</div>
    </div>
  </li>
}

export function NotificationHeader ({ notification }) {
  const { activity: { action, actor, post, meta: { reasons } } } = notification
  switch (action) {
    case ACTION_NEW_COMMENT:
      return <div styleName='header'>
        New Comment on <span styleName='bold'>{post.title}</span>
      </div>
    case ACTION_TAG:
      const tagReason = find(r => r.startsWith('tag: '), reasons)
      const tag = tagReason.split(': ')[1]
      return <div styleName='header'>
        New Post in <span styleName='bold'>#{tag}</span>
      </div>
    case ACTION_JOIN_REQUEST:
      return <div styleName='header'>
        New Join Request
      </div>
    case ACTION_APPROVED_JOIN_REQUEST:
      return <div styleName='header'>
        Join Request Approved
      </div>
    case ACTION_MENTION:
      return <div styleName='header'>
        <span styleName='bold'>{actor.name} </span>
        mentioned you
      </div>
    case ACTION_COMMENT_MENTION:
      return <div styleName='header'>
        <span styleName='bold'>{actor.name} </span>
        mentioned you in a comment on
        <span styleName='bold'> {post.title}</span>
      </div>
  }

  return null
}

export function NotificationBody ({ notification }) {
  const { activity: { action, actor, post, comment, community } } = notification

  const truncateForBody = text =>
    text && textLength(text) > 76 ? truncate(text, 76) : text

  switch (action) {
    case ACTION_NEW_COMMENT:
    case ACTION_COMMENT_MENTION:
      var text = decode(striptags(truncateForBody(comment.text)))
      return <div styleName='body'>
        <span styleName='bold'>{firstName(actor)}</span> wrote: "{text}"
      </div>
    case ACTION_TAG:
    case ACTION_MENTION:
      text = truncateForBody(post.title)
      return <div styleName='body'>
        <span styleName='bold'>{firstName(actor)}</span> wrote: "{text}"
      </div>
    case ACTION_JOIN_REQUEST:
      return <div styleName='body'>
        <span styleName='bold'>{actor.name} </span>
        asked to join
        <span styleName='bold'> {community.name}</span>
      </div>
    case ACTION_APPROVED_JOIN_REQUEST:
      return <div styleName='body'>
        <span styleName='bold'>{actor.name} </span>
        approved your request to join
        <span styleName='bold'> {community.name}</span>
      </div>
  }

  return null
}
