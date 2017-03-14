/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router-dom'
import SampleCard from 'components/SampleCard'

export default function EventDetail ({ match: { params: { eventId } } }) {
  return <div styleName='event-page'>
    <div className='hdr-display'>Event Detail!</div>
    This is the individual event page for event with id { eventId }.
  </div>
}
