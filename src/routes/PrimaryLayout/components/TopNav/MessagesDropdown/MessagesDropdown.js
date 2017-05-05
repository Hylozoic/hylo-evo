import React, { PropTypes, Component } from 'react'
import './MessagesDropdown.scss'
const { object, array, string } = PropTypes
import RoundImage from 'components/RoundImage'
import { Link } from 'react-router-dom'
import { humanDate } from 'hylo-utils/text'
import cx from 'classnames'

export default class MessagesDropdown extends Component {
  static propTypes = {
    toggleChildren: object,
    messages: array,
    className: string
  }

  constructor (props) {
    super(props)
    this.state = {active: true}
  }

  toggle = () => {
    this.setState({active: !this.state.active})
  }

  render () {
    const { toggleChildren, messages, className } = this.props
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
            <Link to='/messages' styleName='new'>New</Link>
          </li>
          <div styleName='messages'>
            {messages.map(message => <li
              styleName='message'
              key={message.id}
              onClick={() => console.log('open message', message.id)}>
              <div styleName='image-wraper'>
                <RoundImage url={message.creator.avatarUrl} styleName='image' />
              </div>
              <div styleName='message-content'>
                <div styleName='name'>{message.creator.name}</div>
                <div styleName='body'>{message.text}</div>
                <div styleName='date'>{humanDate(message.createdAt)}</div>
              </div>
            </li>)}
          </div>
        </ul>
      </div>
    </div>
  }
}
