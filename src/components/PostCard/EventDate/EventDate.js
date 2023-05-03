import React from 'react'
import { DateTime } from 'luxon'
import './EventDate.scss'

export default function EventDate ({ startTime }) {
  if (!startTime) return null

  startTime = DateTime.fromISO(startTime)

  return <div styleName='eventDate'>
    <span styleName='month'>{startTime.toLocaleString({ month: 'short' })}</span>
    <span styleName='day'>{startTime.toLocaleString({ day: 'numeric' })}</span>
  </div>
}
