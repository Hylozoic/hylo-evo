import isMobile from 'ismobilejs'
import React, { Component } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { get, isEmpty, some, find, orderBy } from 'lodash/fp'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { toRefArray, itemsToArray } from 'util/reduxOrmMigration'
import { TextHelpers } from 'hylo-shared'
import { newMessageUrl, messageThreadUrl } from 'util/navigation'
import Icon from 'components/Icon'
import RoundImageRow from 'components/RoundImageRow'
import TopNavDropdown from '../TopNavDropdown'
import { participantAttributes, isUnread, isUpdatedSince } from 'store/models/MessageThread'
import NoItems from 'routes/AuthLayoutRouter/components/TopNav/NoItems'
import LoadingItems from 'routes/AuthLayoutRouter/components/TopNav/LoadingItems'
import './MessagesDropdown.scss'

class MessagesDropdown extends Component {
  constructor (props) {
    super(props)
    this.dropdown = React.createRef()
    this.state = {}
  }

  componentDidMount = () => {
    const { fetchThreads } = this.props
    if (fetchThreads) fetchThreads()
  }

  onToggle = nowActive => {
    // * this is not quite sufficient -- this value should also be bumped
    //   if the current user is in the messages UI, receiving new messages
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

  close = () => {
    this.dropdown.current.toggle(false)
  }

  onClick = id => {
    if (id) this.props.goToThread(id)
    this.dropdown.current.toggle(false)
  }

  render () {
    const {
      renderToggleChildren,
      threads,
      className,
      currentUser,
      pending
    } = this.props

    let body
    if (pending) {
      body = <LoadingItems />
    } else if (isEmpty(threads)) {
      body = <NoItems message={this.props.t("You don't have any messages yet")} />
    } else {
      body = <div styleName='threads'>
        {threads.map(thread =>
          <MessagesDropdownItem
            thread={thread}
            onClick={() => this.onClick(thread.id)}
            currentUser={currentUser}
            key={thread.id}
          />
        )}
      </div>
    }

    const firstThreadUrl = !isEmpty(threads)
      ? isMobile.any ? '/messages' : messageThreadUrl(threads[0].id)
      : newMessageUrl()

    return <TopNavDropdown
      ref={this.dropdown}
      className={className}
      onToggle={this.onToggle}
      toggleChildren={renderToggleChildren(this.hasUnread())}
      header={
        <div styleName='header-content'>
          <Link to={firstThreadUrl} styleName='open' onClick={this.close}>
            <Icon styleName='open-icon' name='ArrowForward' /> {this.props.t('Open Messages')}
          </Link>
          <Link to={newMessageUrl()} styleName='new' onClick={this.close}><Icon name='SmallEdit' styleName='new-icon' /> {this.props.t('New')}</Link>
        </div>}
      body={body}
    />
  }
}

MessagesDropdown.propTypes = {
  className: PropTypes.any,
  currentUser: PropTypes.object,
  fetchThreads: PropTypes.func,
  goToThread: PropTypes.func,
  pending: PropTypes.any,
  renderToggleChildren: PropTypes.func,
  threads: PropTypes.array
}

const MAX_MESSAGE_LENGTH = 145

export function MessagesDropdownItem ({ thread, onClick, currentUser }) {
  if (!thread) return null

  const messages = toRefArray(itemsToArray(thread.messages))
  const message = orderBy(m => Date.parse(m.createdAt), 'desc', messages)[0]

  if (!message || !message.text) return null

  const participants = toRefArray(thread.participants)
  const { names, avatarUrls } = participantAttributes(thread, currentUser, 2)
  let displayText = lastMessageCreator(message, currentUser, participants) + message.text

  displayText = TextHelpers.presentHTMLToText(displayText, { truncate: MAX_MESSAGE_LENGTH })

  return <li styleName={cx('thread', { unread: isUnread(thread) })}
    onClick={onClick}>
    <div styleName='image-wrapper'>
      <RoundImageRow imageUrls={avatarUrls} vertical ascending cap='2' />
    </div>
    <div styleName='message-content'>
      <div styleName='name'>{names}</div>
      <div styleName='body'>{displayText}</div>
      <div styleName='date'>{TextHelpers.humanDate(thread.updatedAt)}</div>
    </div>
  </li>
}

MessagesDropdownItem.propTypes = {
  currentUser: PropTypes.any,
  onClick: PropTypes.any,
  thread: PropTypes.any,
  maxMessageLength: PropTypes.number
}

export function lastMessageCreator (message, currentUser, participants) {
  const { t } = useTranslation()
  const creatorPersonId = get('creator.id', message) || get('creator', message)

  if (creatorPersonId === currentUser.id) return t('You') + ': '
  if (participants.length <= 2) return ''

  const creator = find(p => p.id === creatorPersonId, participants)
  return (creator?.name || 'Unknown User') + ': '
}

export default withTranslation()(MessagesDropdown)
