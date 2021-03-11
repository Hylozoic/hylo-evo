import PropTypes from 'prop-types'
import React, { Component } from 'react'
const { array } = PropTypes

import './MembersWidget.scss'

export default class MembersWidget extends Component {
  static propTypes = {
    members: array
  }

  constructor () {
    super()
  }

  render () {
    const { members } = this.props
    return (
      <div>
        {members.map(m => <div>{m.name}</div>)}
      </div>
    )
  }
}
