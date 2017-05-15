import React, { PropTypes, Component } from 'react'
import './MessagesDropdown.scss'
const { object, array, string, func } = PropTypes
import BadgedIcon from 'components/BadgedIcon'
import { Link } from 'react-router-dom'
import { humanDate, textLength, truncate } from 'hylo-utils/text'
import cx from 'classnames'
import { newMessageUrl, messagesUrl } from 'util/index'
import RoundImageRow from 'components/RoundImageRow'

export default class MessagesDropdown extends Component {
  static propTypes = {
    fetchThreads: func,
    toggleChildren: object,
    threads: array,
    className: string,
    goToThread: func
  }

  constructor (props) {
    super(props)
    this.state = {active: false}
  }

  componentDidMount () {
    this.props.fetchThreads()
  }

  toggle = () => {
    this.setState({active: !this.state.active})
  }

  render () {
    const { threads, className, goToThread, currentUser } = this.props
    const { active } = this.state

    return <div styleName='messages-dropdown'>
      <a onClick={this.toggle}>
        <BadgedIcon name='Messages' className={className} />
      </a>
      <div styleName={cx('wrapper', {active})}>
        <ul styleName='menu'>
          <li styleName='triangle' />
          <li styleName='header'>
            <Link to={messagesUrl()} styleName='open'>Open Messages</Link>
            <Link to={newMessageUrl()} styleName='new'>New</Link>
          </li>
          <div styleName='threads'>
            {threads.map(thread => <Thread
              thread={thread}
              goToThread={goToThread}
              currentUserId={currentUser.id}
              key={thread.id} />)}
          </div>
        </ul>
      </div>
    </div>
  }
}

const participantNames = participants => {
  const length = participants.length
  if (length === 1) {
    return participants[0].name
  } else if (length === 2) {
    return `${participants[0].name} and ${participants[1].name}`
  } else if (length > 2) {
    const n = length - 2
    return `${participants[0].name}, ${participants[1].name} and ${n} other${n > 1 ? 's' : ''}`
  }
}

export function Thread ({ thread, goToThread, currentUserId }) {
  const message = thread.messages[0]
  if (!message || !message.text) return null
  const participants = thread.participants.filter(p => p.id !== currentUserId)

  const unread = thread.lastReadAt < thread.updatedAt

  var { text } = message
  if (message.creator.id === currentUserId) {
    text = `You: ${text}`
  }

  const maxMessageLength = 145

  if (textLength(text) > maxMessageLength) {
    text = `${truncate(text, maxMessageLength)}...`
  }

  return <li styleName={cx('thread', {unread})}
    onClick={goToThread(thread.id)}>
    <div styleName='image-wrapper'>
      <RoundImageRow imageUrls={participants.map(p => p.avatarUrl)} vertical ascending cap='2' />
    </div>
    <div styleName='message-content'>
      <div styleName='name'>{participantNames(participants)}</div>
      <div styleName='body'>{text}</div>
      <div styleName='date'>{humanDate(thread.updatedAt)}</div>
    </div>
  </li>
}
