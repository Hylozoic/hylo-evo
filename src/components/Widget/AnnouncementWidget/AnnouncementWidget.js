import PropTypes from 'prop-types'
import React, { Component } from 'react'
const { array } = PropTypes

import './AnnouncementWidget.scss'

export default class AnnouncementWidget extends Component {
  static propTypes = {
    announcements: array
  }

  constructor () {
    super()
  }

  render () {
    const { announcements = [] } = this.props
    return (
      <div>
        {announcements.map(a => <div>{a.title}</div>)}
      </div>
    )
  }
}
