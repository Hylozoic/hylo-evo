import React, { PropTypes, Component } from 'react'
import { map } from 'lodash/fp'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import RoundImage from 'components/RoundImage'
import Badge from 'components/Badge'
import Button from 'components/Button'
import TextInput from 'components/TextInput'
import './ThreadList.scss'
const { array, string } = PropTypes

export default class ThreadList extends Component {
  static propTypes = {
    threads: array,
    activeId: string
  }

  render () {
    const { threads, activeId } = this.props
    console.log(threads)
    return <div styleName='thread-list'>
      <div styleName='header'>
        <Link to='/messages/new'><Button label='New Message' styleName='new-message' /></Link>
        <div styleName='header-text'>Messages</div>
      </div>
      <div styleName='search'>
        <TextInput placeholder='Search Messages' />
      </div>
      <ul styleName='list'>
        {threads.map(t => {
          return <ThreadListItem id={t.id}
            active={t.id === activeId}
            participants={t.participants}
            latestMessage={t.messages[0]}
            unreadCount={2} />
        })}
      </ul>
    </div>
  }
}

function ThreadListItem ({active, id, participants, latestMessage, unreadCount}) {
  return <li styleName='list-item'>
    <Link to={`/t/${id}`}>
      {active && <div styleName='active-thread' />}
      <ThreadAvatars avatarUrls={map('avatarUrl', participants)} />
      <div styleName='li-center-content'>
        <ThreadNames names={map('name', participants)} />
        <div styleName='thread-message-text'>{latestMessage.message}</div>
      </div>
      <div styleName='li-right-content'>
        <div styleName='message-time'>15:45</div>
        {unreadCount && <Badge number={unreadCount} expanded />}
      </div>
    </Link>
  </li>
}

function ThreadAvatars ({avatarUrls}) {
  // {avatarUrls[0]}
  return <div styleName='thread-avatars'>
    <RoundImage url={avatarUrls[0]} medium />
  </div>
}

function ThreadNames ({names}) {
  return <div styleName='thread-names'>
    {names[0]}
  </div>
}
