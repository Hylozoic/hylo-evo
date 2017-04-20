import React, { PropTypes, Component } from 'react'
import { filter, get, map } from 'lodash/fp'
import { Link } from 'react-router-dom'
import RoundImage from 'components/RoundImage'
import Badge from 'components/Badge'
import Button from 'components/Button'
import TextInput from 'components/TextInput'
import { humanDate } from 'hylo-utils/text'
import './ThreadList.scss'
const { array, func, object, string } = PropTypes

export default class ThreadList extends Component {
  static propTypes = {
    currentUser: object,
    threadSearch: string,
    threads: array,
    activeId: string,
    fetchThreads: func,
    setThreadSearch: func
  }

  componentDidMount () {
    this.props.fetchThreads()
  }

  render () {
    const { currentUser, threads, threadSearch, activeId, setThreadSearch } = this.props
    const onSearchChange = (event) => setThreadSearch(event.target.value)
    return <div styleName='thread-list'>
      <div styleName='header'>
        <Link to='/messages/new'><Button label='New Message' styleName='new-message' /></Link>
        <div styleName='header-text'>Messages</div>
      </div>
      <div styleName='search'>
        <TextInput placeholder='Search for people...' value={threadSearch} onChange={onSearchChange} />
      </div>
      <ul styleName='list'>
        {threads.map(t => {
          return <ThreadListItem id={t.id}
            key={`thread-li-${t.id}`}
            currentUser={currentUser}
            active={t.id === activeId}
            participants={t.participants}
            latestMessage={t.messages[0]}
            unreadCount={t.unreadCount} />
        })}
      </ul>
    </div>
  }
}

function ThreadListItem ({currentUser, active, id, participants, latestMessage, unreadCount}) {
  const otherParticipants = filter(p => p.id !== get('id', currentUser), participants)
  return <li styleName='list-item'>
    <Link to={`/t/${id}`}>
      {active && <div styleName='active-thread' />}
      <ThreadAvatars avatarUrls={map('avatarUrl', otherParticipants)} />
      <div styleName='li-center-content'>
        <ThreadNames names={map('name', otherParticipants)} />
        <div styleName='thread-message-text'>{get('text', latestMessage)}</div>
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
  let nameString = ''
  switch (names.length) {
    case 1:
    case 2:
      nameString = names.join(', ')
      break
    default:
      nameString = `${names.slice(0, 1).join(', ')} and ${names.length - 1} other${names.length > 2 ? 's' : ''}`
      break
  }
  return <div styleName='thread-names'>
    {nameString}
  </div>
}
