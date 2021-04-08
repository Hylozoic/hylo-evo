import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'

import './MembersWidget.scss'

const { array } = PropTypes

export default class MembersWidget extends Component {
  static propTypes = {
    members: array
  }

  render () {
    const { members } = this.props
    return (
      <div styleName='active-users'>
        {members && members.map(m => <div key={m.id} styleName='active-user' style={{ backgroundImage: `url(${m.avatarUrl})` }}>
          <div styleName='user-name'>{m.name.split(' ')[0]}</div>
          <div styleName='user-controls'>
            <Link to='#'><Icon name='Messages' styleName='user-message-icon' /></Link>
            <Link to='#'><Icon name='Person' styleName='user-profile-icon' /></Link>
          </div>
          <div styleName='user-background' />
        </div>)}
        <div styleName='members-link'>
          <Link to='#'>View all</Link>
        </div>
        <div styleName='right-fade' />
      </div>
    )
  }
}
