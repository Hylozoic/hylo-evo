import React, { PropTypes, Component } from 'react'
import './MessagesDropdown.scss'
const { object, array, string, func } = PropTypes
import RoundImage from 'components/RoundImage'
import { Link } from 'react-router-dom'
import { humanDate } from 'hylo-utils/text'
import cx from 'classnames'
import { newMessageUrl } from 'util/index'
import Loading from 'components/Loading'

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

export function Thread ({ thread, goToThread, currentUserId }) {
  const message = thread.messages[0]
  if (!message || !message.text) return null
  const participant = thread.participants.filter(p => p.id !== currentUserId)[0]
  return <li styleName='thread'
    onClick={goToThread(thread.id)}>
    <div styleName='image-wraper'>
      <RoundImage url={participant.avatarUrl} styleName='image' />
    </div>
    <div styleName='message-content'>
      <div styleName='name'>{participant.name}</div>
      <div styleName='body'>{thread.messages[0].text}</div>
      <div styleName='date'>{humanDate(thread.updatedAt)}</div>
    </div>
  </li>
}
