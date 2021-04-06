import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './EventsWidget.scss'

const { array } = PropTypes

export default class EventsWidget extends Component {
  static propTypes = {
    events: array
  }

  render () {
    const { events } = this.props
    // TODO: Can use the Event component on MemberProfile
    return (
      <div>
        {events && events.map(e => <div key={e.id}>{e.title}</div>)}
      </div>
    )
  }
}
