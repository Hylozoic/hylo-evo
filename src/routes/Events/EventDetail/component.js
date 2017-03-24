/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import SampleCard from 'components/SampleCard'
import styles from './component.scss' // eslint-disable-line no-unused-vars

export default function EventDetail ({ match: { params: { eventId } } }) {
  return <div styleName='event-page'>
    <div className='hdr-display'>Event Detail!</div>
    This is the individual event page for event with id { eventId }.
  </div>
}
