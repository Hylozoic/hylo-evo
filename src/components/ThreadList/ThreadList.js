import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { get, isEmpty } from 'lodash/fp'
import { Link } from 'react-router-dom'
import RoundImage from 'components/RoundImage'
import Badge from 'components/Badge'
import Button from 'components/Button'
import TextInput from 'components/TextInput'
import ScrollListener from 'components/ScrollListener'
import { humanDate } from 'hylo-utils/text'
import './ThreadList.scss'
const { array, func, object, string } = PropTypes

export default class ThreadList extends Component {
  static propTypes = {
    match: object,
    currentUser: object,
    threadSearch: string,
    threads: array,
    fetchThreads: func,
    setThreadSearch: func,
    className: string
  }

  componentDidMount () {
    if (isEmpty(this.props.threads)) this.props.fetchThreads()
  }

  render () {
    const {
      currentUser,
      threads,
      threadSearch,
      setThreadSearch,
      fetchMoreThreads,
      match: { params: { threadId } },
      className
    } = this.props
    const onSearchChange = (event) => setThreadSearch(event.target.value)

    return <div styleName='thread-list' className={className}>
      <div styleName='header'>
        <Link to='/t/new'><Button label='New Message' styleName='new-message' /></Link>
        <div styleName='header-text'>Messages</div>
      </div>
      <div styleName='search'>
        <TextInput placeholder='Search for people...' value={threadSearch} onChange={onSearchChange} />
      </div>
      <ul styleName='list' id={'thread-list-list'}>
        {threads.map(t => {
          return <ThreadListItem id={t.id}
            key={`thread-li-${t.id}`}
            currentUser={currentUser}
            active={t.id === threadId}
            thread={t}
            latestMessage={t.messages.orderBy(m => Date.parse(m.createdAt), 'desc').first()}
            unreadCount={t.unreadCount} />
        })}
        {!threads.length && !threadSearch && <div styleName='no-conversations'>You have no active conversations</div>}
        {!threads.length && threadSearch && <div styleName='no-conversations'>No conversations found</div>}
      </ul>
      <ScrollListener
        elementId={'thread-list-list'}
        onBottom={fetchMoreThreads} />
    </div>
  }
}

export function ThreadListItem ({currentUser, active, id, thread, latestMessage, unreadCount}) {
  let text = ''
  const maxTextLength = 54
  if (latestMessage) {
    text = latestMessage.text.substring(0, maxTextLength)
    if (latestMessage.text.length > maxTextLength) {
      text += '...'
    }
  }

  const { names, avatarUrls } = thread.participantAttributes(currentUser, 2)

  return <li styleName='list-item'>
    <Link to={`/t/${id}`}>
      {active && <div styleName='active-thread' />}
      <ThreadAvatars avatarUrls={avatarUrls} />
      <div styleName='li-center-content'>
        <ThreadNames names={names} />
        <div styleName='thread-message-text'>{text}</div>
      </div>
      <div styleName='li-right-content'>
        <div styleName='message-time'>{humanDate(get('createdAt', latestMessage))}</div>
        {unreadCount > 0 && <Badge number={unreadCount} expanded />}
      </div>
    </Link>
  </li>
}

function ThreadAvatars ({avatarUrls}) {
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

function ThreadNames ({names}) {
  return <div styleName='thread-names'>
    {names}
  </div>
}
