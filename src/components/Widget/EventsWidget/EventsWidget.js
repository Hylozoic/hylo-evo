import PropTypes from 'prop-types'
import React, { Component } from 'react'
const { array } = PropTypes

import './EventsWidget.scss'

export default class EventsWidget extends Component {
  static propTypes = {
    events: array
  }

  constructor () {
    super()
  }

  render () {
    const { events, routeParams, showDetails } = this.props
    // Can use the Event component on MemberProfile
    return (
      <div>
        {events.map(e => <div>{e.title}</div>)}
      </div>
    )
  }
}
