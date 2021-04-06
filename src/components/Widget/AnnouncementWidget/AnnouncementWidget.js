import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './AnnouncementWidget.scss'

const { array } = PropTypes

export default class AnnouncementWidget extends Component {
  static propTypes = {
    announcements: array
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
