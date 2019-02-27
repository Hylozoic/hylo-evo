import React from 'react'
import Moment from 'moment'
import './EventDate.scss'

export default function EventDate ({ startTime }) {
  if (!startTime) return null
  const moment = Moment(startTime)
  return <div styleName='eventDate'>
    <span styleName='month'>{moment.format('MMM')}</span>
    <span styleName='day'>{moment.format('D')}</span>    
  </div>
}