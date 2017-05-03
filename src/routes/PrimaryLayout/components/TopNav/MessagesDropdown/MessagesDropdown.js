import React, { PropTypes, Component } from 'react'
import './MessagesDropdown.scss'
const { object, array } = PropTypes
import Dropdown from 'components/Dropdown'
import RoundImage from 'components/RoundImage'
import { Link } from 'react-router-dom'
import { humanDate } from 'hylo-utils/text'

export default class MessagesDropdown extends Component {
  static propTypes = {
    toggleChildren: object,
    messages: array
  }

  render () {
    const { toggleChildren, messages } = this.props
    return <Dropdown toggleChildren={toggleChildren}>
      <li>
        <span>Open Messages</span>
        <Link to='/messages'>New</Link>
      </li>
      {messages.map(message => <li>
        <RoundImage url={message.creator.avatarUrl} />
        <div>{message.creator.name}</div>
        <div>{message.text}</div>
        <div>{humanDate(message.createdAt)}</div>
      </li>)}
    </Dropdown>
  }
}
