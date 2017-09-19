import React, { PropTypes, Component } from 'react'
import './NotificationsDropdown.scss'
const { array, string, func } = PropTypes
import { humanDate, textLength, truncate } from 'hylo-utils/text'
import cx from 'classnames'
import RoundImage from 'components/RoundImage'
import { firstName } from 'store/models/Person'
import TopNavDropdown from '../TopNavDropdown'
import { find, isEmpty } from 'lodash/fp'
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
import NoItems from 'routes/AuthLayout/components/TopNav/NoItems'
import LoadingItems from 'routes/AuthLayout/components/TopNav/LoadingItems'

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

  render () {
    const {
      fetchNotifications,
      renderToggleChildren,
      className,
      goToNotification,
      markActivityRead,
      markAllActivitiesRead,
      currentUser,
      pending
    } = this.props
    var { notifications } = this.props
    const { showingUnread } = this.state

    const showRecent = () => this.setState({showingUnread: false})
    const showUnread = () => this.setState({showingUnread: true})

    if (showingUnread) {
      notifications = notifications.filter(n => n.activity.unread)
    }

    const onClick = notification => {
      if (notification.activity.unread) markActivityRead(notification.activity.id)
      goToNotification(notification)
      this.refs.dropdown.getWrappedInstance().toggle(false)
    }

    const showBadge = currentUser && currentUser.newNotificationCount > 0

    let body
    if (pending) {
      body = <LoadingItems />
    } else if (isEmpty(notifications)) {
      body = <NoItems message='No notifications' />
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
      onFirstOpen={fetchNotifications}
      toggleChildren={renderToggleChildren(showBadge)}
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
