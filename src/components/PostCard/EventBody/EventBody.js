import React from 'react'
import { decode } from 'ent'
import path from 'path'
import { pick } from 'lodash/fp'
import Highlight from 'components/Highlight'
import Icon from 'components/Icon'
import ClickCatcher from 'components/ClickCatcher'
import LinkPreview from '../LinkPreview'
import { sanitize, present, textLength, truncate } from 'hylo-utils/text'
import EventDate from '../EventDate'
import EventRSVP from '../EventRSVP'
import PostTitle from '../PostTitle'
import PostDetails from '../PostDetails'
import '../PostBody/PostBody.scss'
import cx from 'classnames'
import moment from 'moment'

const maxDetailsLength = 144

export const formatDates = (startTime, endTime) => {
  const start = moment(startTime)
  const end = moment(endTime)

  const from = start.format('ddd, MMM D [at] h:mmA')

  var to = ''

  if (endTime) {
    if (end.month() !== start.month()) {
      to = end.format(' - ddd, MMM D [at] h:mmA')
    } else if (end.day() !== start.day()) {
      to = end.format(' - ddd D [at] h:mmA')
    } else {
      to = end.format(' - h:mmA')
    }
  }

  return from + to
}

export default function EventBody ({
  event,
  respondToEvent,
  slug,
  expanded,
  className
}) {
  const { startTime, endTime, location } = event

  return <div styleName={cx('body', 'eventBody', {smallMargin: !expanded})} className={className}>
    <EventDate {...event} />
    <div styleName='eventBodyColumn'>
      <PostTitle {...event} />
      <div styleName='eventData'>
        <Icon name='Clock' styleName='icon' /> {formatDates(startTime, endTime)}
      </div>
      {!!location && <div styleName='eventData eventLocation'>
        <Icon name='Location' styleName='icon' /> {location}
      </div>}
      <PostDetails {...event} slug={slug} hideDetails={!expanded} expanded={expanded} />
    </div>
    <EventRSVP {...event} respondToEvent={respondToEvent} />    
  </div>
}
