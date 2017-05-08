import React, { PropTypes, Component } from 'react'
import './MessagesDropdown.scss'
const { object, array, string, func } = PropTypes
import { Link } from 'react-router-dom'
import { humanDate } from 'hylo-utils/text'
import cx from 'classnames'
import { newMessageUrl } from 'util/index'
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
    this.state = {active: true}
  }

  componentDidMount () {
    this.props.fetchThreads()
  }

  toggle = () => {
    this.setState({active: !this.state.active})
  }

  render () {
    const { toggleChildren, threads, className, goToThread, currentUser } = this.props
    const { active } = this.state

    return <div className={className} styleName='messages-dropdown'>
      <a onClick={this.toggle}>
        {toggleChildren}
      </a>
      <div styleName={cx('wrapper', {active})}>
        <ul styleName='menu'>
          <li styleName='triangle' />
          <li styleName='header'>
            <span>Open Messages</span>
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
  return <li styleName='thread'
    onClick={goToThread(thread.id)}>
    <div styleName='image-wraper'>
      <RoundImageRow imageUrls={participants.map(p => p.avatarUrl)} vertical cap='2' />
    </div>
    <div styleName='message-content'>
      <div styleName='name'>{participantNames(participants)}</div>
      <div styleName='body'>{thread.messages[0].text}</div>
      <div styleName='date'>{humanDate(thread.updatedAt)}</div>
    </div>
  </li>
}
