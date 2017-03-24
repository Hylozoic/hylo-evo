/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import './component.scss'

export default function EventDetail ({ match: { params: { eventId } } }) {
  return <div styleName='event-page'>
    <div className='hdr-display'>Event Detail!</div>
    This is the individual event page for event with id { eventId }.
  </div>
}
