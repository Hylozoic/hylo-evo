import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get, isEmpty, orderBy } from 'lodash/fp'
import { Link } from 'react-router-dom'
import { humanDate } from 'hylo-utils/text'
import RoundImage from 'components/RoundImage'
import Badge from 'components/Badge'
import Button from 'components/Button'
import TextInput from 'components/TextInput'
import ScrollListener from 'components/ScrollListener'
import { toRefArray, itemsToArray } from 'store/models'
import { participantAttributes } from 'store/models/MessageThread'
import './ThreadList.scss'

export default class ThreadList extends Component {
  static defaultProps = {
    threads: []
  }

  componentDidMount () {
    if (isEmpty(this.props.threads)) this.props.fetchThreads()
  }

  render () {
    const {
      currentUser,
      threadsPending,
      threads,
      threadSearch,
      setThreadSearch,
      fetchMoreThreads,
      match: { params: { messageThreadId } },
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
        {!threadsPending && threads.map(t => {
          const messages = toRefArray(itemsToArray(t.messages))
          // TODO: Look at why orderBy wasn't doing what was expected
          // orderBy(m => Date.parse(m.createdAt), 'desc', messages)
          const latestMessage = messages[messages.length - 1]
          return <ThreadListItem id={t.id}
            key={`thread-li-${t.id}`}
            currentUser={currentUser}
            active={t.id === messageThreadId}
            thread={t}
            latestMessage={latestMessage}
            unreadCount={t.unreadCount} />
        })}
        {threadsPending &&
          <div styleName='no-conversations'>Loading conversations...</div>}
        {!threadsPending && !threads.length && !threadSearch &&
          <div styleName='no-conversations'>You have no active conversations</div>}
        {!threadsPending && !threads.length && threadSearch &&
          <div styleName='no-conversations'>No conversations found</div>}
      </ul>
      <ScrollListener
        elementId={'thread-list-list'}
        onBottom={fetchMoreThreads} />
    </div>
  }
}

ThreadList.propTypes = {
  className: PropTypes.string,
  currentUser: PropTypes.object,
  fetchMoreThreads: PropTypes.func,
  fetchThreads: PropTypes.func,
  match: PropTypes.object,
  setThreadSearch: PropTypes.func,
  threadSearch: PropTypes.string,
  threads: PropTypes.array,
  threadsPending: PropTypes.bool
}

export function ThreadListItem ({ currentUser, active, id, thread, latestMessage, unreadCount }) {
  const maxTextLength = 54
  let text = ''

  if (latestMessage) {
    text = latestMessage.text.substring(0, maxTextLength)
    if (latestMessage.text.length > maxTextLength) {
      text += '...'
    }
  }

  const { names, avatarUrls } = participantAttributes(thread, currentUser, 2)

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
