import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'
import AutocompletePerson from 'components/AutocompletePerson'
import Icon from 'components/Icon'
import MessageForm from 'components/MessageForm'
import './NewThread.scss'

export default class NewThread extends Component {
  static propTypes = {

  }

  render () {
    return <div styleName='newThread'>
      <div styleName='header'>
        <AutocompletePerson />
        <Icon name='More' styleName='more-icon' />
        <Link to='/' styleName='close-messages'>
          <Icon name='Ex' styleName='close-messages-icon' />
        </Link>
      </div>
      <div styleName='message-form'>
        <MessageForm ref='form' />
      </div>
    </div>
  }
}
