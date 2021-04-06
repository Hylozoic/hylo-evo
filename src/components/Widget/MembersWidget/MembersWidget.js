import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './MembersWidget.scss'

const { array } = PropTypes

export default class MembersWidget extends Component {
  static propTypes = {
    members: array
  }

  render () {
    const { members } = this.props
    return (
      <div>
        {members && members.map(m => <div key={m.id}>{m.name}</div>)}
      </div>
    )
  }
}
