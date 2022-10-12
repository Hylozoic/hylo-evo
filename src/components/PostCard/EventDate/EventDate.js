import React from 'react'
import Moment from 'moment-timezone'
import './EventDate.scss'

export default function EventDate ({ startTime }) {
  if (!startTime) return null
  const startTimeMoment = Moment(startTime)
  return <div styleName='eventDate'>
    <span styleName='month'>{startTimeMoment.format('MMM')}</span>
    <span styleName='day'>{startTimeMoment.format('D')}</span>
  </div>
}
