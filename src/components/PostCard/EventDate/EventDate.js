import React from 'react'
import Moment from 'moment-timezone'
import classes from './EventDate.module.scss'

export default function EventDate ({ startTime }) {
  if (!startTime) return null
  const startTimeMoment = Moment(startTime)
  return <div className={classes.eventDate}>
    <span className={classes.month}>{startTimeMoment.format('MMM')}</span>
    <span className={classes.day}>{startTimeMoment.format('D')}</span>
  </div>
}
