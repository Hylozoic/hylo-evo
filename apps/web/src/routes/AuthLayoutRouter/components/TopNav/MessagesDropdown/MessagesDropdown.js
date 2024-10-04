import isMobile from 'ismobilejs'
import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { isEmpty, some } from 'lodash/fp'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toRefArray, itemsToArray } from 'util/reduxOrmMigration'
import { TextHelpers } from 'hylo-shared'
import { newMessageUrl, messageThreadUrl } from 'util/navigation'
import Icon from 'components/Icon'
import RoundImageRow from 'components/RoundImageRow'
import TopNavDropdown from '../TopNavDropdown'
import { participantAttributes, isUnread, isUpdatedSince } from 'store/models/MessageThread'
import NoItems from 'routes/AuthLayoutRouter/components/TopNav/NoItems'
import LoadingItems from 'routes/AuthLayoutRouter/components/TopNav/LoadingItems'
import fetchThreads from 'store/actions/fetchThreads'
import { getThreads } from 'routes/Messages/Messages.store'
import getMe from 'store/selectors/getMe'
import { FETCH_THREADS } from 'store/constants'

import classes from './MessagesDropdown.module.scss'

const MessagesDropdown = ({
  renderToggleChildren,
  className
}) => {
  const [lastOpenedAt, setLastOpenedAt] = useState(null)
  const dropdown = useRef(null)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const currentUser = useSelector(state => getMe(state))
  const threads = useSelector(state => getThreads(state))
  const pending = useSelector(state => state.pending[FETCH_THREADS])

  useEffect(() => {
    dispatch(fetchThreads(10, 0))
  }, [dispatch])

  const onToggle = nowActive => {
    if (nowActive) setLastOpenedAt(new Date())
  }

  const hasUnread = () => {
    if (isEmpty(threads)) {
      return currentUser && currentUser.unseenThreadCount > 0
    }

    return some(
      thread => isUnread(thread) && (!lastOpenedAt || isUpdatedSince(thread, lastOpenedAt)),
      threads
    )
  }

  const close = () => {
    dropdown.current.toggle(false)
  }

  const onClick = id => {
    if (id) navigate(messageThreadUrl(id))
    dropdown.current.toggle(false)
  }

  let body
  if (pending) {
    body = <LoadingItems />
  } else if (isEmpty(threads)) {
    body = <NoItems message={t("You don't have any messages yet")} />
  } else {
    body = (
      <div className={classes.threads}>
        {threads.map(thread =>
          <MessagesDropdownItem
            thread={thread}
            onClick={() => onClick(thread.id)}
            currentUser={currentUser}
            key={thread.id}
          />
        )}
      </div>
    )
  }

  const firstThreadUrl = !isEmpty(threads)
    ? isMobile.any ? '/messages' : messageThreadUrl(threads[0].id)
    : newMessageUrl()

  return (
    <TopNavDropdown
      ref={dropdown}
      className={className}
      onToggle={onToggle}
      toggleChildren={renderToggleChildren(hasUnread())}
      header={
        <div className={classes.headerContent}>
          <Link to={firstThreadUrl} className={classes.open} onClick={close}>
            <Icon className={classes.openIcon} name='ArrowForward' /> {t('Open Messages')}
          </Link>
          <Link to={newMessageUrl()} className={classes.new} onClick={close}><Icon name='SmallEdit' className={classes.newIcon} /> {t('New')}</Link>
        </div>
      }
      body={body}
    />
  )
}

const MAX_MESSAGE_LENGTH = 145

export function MessagesDropdownItem ({ thread, onClick, currentUser }) {
  const { t } = useTranslation()

  if (!thread) return null

  const messages = toRefArray(itemsToArray(thread.messages))
  const message = messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]

  if (!message || !message.text) return null

  const participants = toRefArray(thread.participants)
  const { names, avatarUrls } = participantAttributes(thread, currentUser, 2)
  let displayText = lastMessageCreator(message, currentUser, participants, t) + message.text

  displayText = TextHelpers.presentHTMLToText(displayText, { truncate: MAX_MESSAGE_LENGTH })

  return (
    <li className={`${classes.thread} ${isUnread(thread) ? classes.unread : ''}`} onClick={onClick}>
      <div className={classes.imageWrapper}>
        <RoundImageRow imageUrls={avatarUrls} vertical ascending cap='2' />
      </div>
      <div className={classes.messageContent}>
        <div className={classes.name}>{names}</div>
        <div className={classes.body}>{displayText}</div>
        <div className={classes.date}>{TextHelpers.humanDate(thread.updatedAt)}</div>
      </div>
    </li>
  )
}

MessagesDropdownItem.propTypes = {
  currentUser: PropTypes.any,
  onClick: PropTypes.any,
  thread: PropTypes.any
}

export function lastMessageCreator (message, currentUser, participants, t) {
  const creatorPersonId = message.creator?.id || message.creator

  if (creatorPersonId === currentUser.id) return t('You') + ': '
  if (participants.length <= 2) return ''

  const creator = participants.find(p => p.id === creatorPersonId)
  return (creator?.name || 'Unknown User') + ': '
}

export default MessagesDropdown
