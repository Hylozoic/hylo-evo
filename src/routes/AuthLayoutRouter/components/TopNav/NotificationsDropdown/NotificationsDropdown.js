import cx from 'classnames'
import { isEmpty, some } from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { TextHelpers } from 'hylo-shared'
import RoundImage from 'components/RoundImage'
import ScrollListener from 'components/ScrollListener/ScrollListener'
import LoadingItems from 'routes/AuthLayoutRouter/components/TopNav/LoadingItems'
import NoItems from 'routes/AuthLayoutRouter/components/TopNav/NoItems'
import { bodyForNotification, titleForNotification } from 'store/models/Notification'
import TopNavDropdown from '../TopNavDropdown'

import './NotificationsDropdown.scss'

class NotificationsDropdown extends Component {
  static propTypes = {
    fetchNotifications: PropTypes.func,
    markActivityRead: PropTypes.func,
    markAllActivitiesRead: PropTypes.func,
    renderToggleChildren: PropTypes.func,
    hasMore: PropTypes.bool,
    fetchMore: PropTypes.func,
    notifications: PropTypes.array,
    className: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      showingUnread: false
    }

    this.dropdownRef = React.createRef()
  }

  onToggle = nowActive => {
    const { fetchNotifications, pending } = this.props
    if (nowActive) {
      this.setState({ lastOpenedAt: new Date() })
      if (!pending) fetchNotifications()
    }
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
      pending,
      hasMore,
      t
    } = this.props

    const { showingUnread } = this.state

    const showRecent = () => this.setState({ showingUnread: false })
    const showUnread = () => this.setState({ showingUnread: true })

    const notifications = showingUnread
      ? this.props.notifications.filter(n => n.activity.unread)
      : this.props.notifications

    const onClick = (notification) => {
      if (notification.activity.unread) markActivityRead(notification.activity.id)
      goToNotification(notification)
      this.dropdownRef.current.toggle(false)
    }

    const message = showingUnread ? t('No unread notifications') : t('No notifications')

    let body
    if (pending && notifications.length === 0) {
      body = <LoadingItems />
    } else if (isEmpty(notifications)) {
      body = <NoItems message={message} />
    } else {
      body = (
        <div styleName='notifications' id='notifications-scroll-list'>
          {notifications.map(notification => <Notification
            notification={notification}
            onClick={onClick}
            key={notification.id} />)}
          <ScrollListener
            elementId='notifications-scroll-list'
            onBottom={hasMore ? () => this.props.fetchMore(this.props.notifications.length) : () => {}}
          />
          {pending && <LoadingItems />}
        </div>
      )
    }

    return (
      <TopNavDropdown
        ref={this.dropdownRef}
        className={className}
        onToggle={this.onToggle}
        toggleChildren={renderToggleChildren(this.hasUnread())}
        header={
          <div styleName='header-content'>
            <span onClick={showRecent} styleName={cx('tab', { active: !showingUnread })}>
              {this.props.t('Recent')}
            </span>
            <span onClick={showUnread} styleName={cx('tab', { active: showingUnread })}>
              {this.props.t('Unread')}
            </span>
            <span onClick={markAllActivitiesRead} styleName='mark-read'>{this.props.t('Mark all as read')}</span>
          </div>
        }
        body={body}
      />
    )
  }
}

export function Notification ({ notification, onClick }) {
  const { activity: { unread, actor } } = notification
  const { t } = useTranslation()

  return (
    <li
      styleName={cx('notification', { unread })}
      onClick={() => onClick(notification)}
    >
      <div styleName='image-wraper'>
        <RoundImage url={actor.avatarUrl} />
      </div>
      <div styleName='content'>
        <div styleName='header'>
          <span
            dangerouslySetInnerHTML={{ __html: titleForNotification(notification, t) }}
          />
        </div>
        <div styleName='body'>
          <span
            dangerouslySetInnerHTML={{ __html: bodyForNotification(notification, t) }}
          />
        </div>
        <div styleName='date'>{TextHelpers.humanDate(notification.createdAt)}</div>
      </div>
    </li>
  )
}

export default withTranslation()(NotificationsDropdown)
