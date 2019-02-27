import React from 'react'
import { decode } from 'ent'
import path from 'path'
import { pick, get } from 'lodash/fp'
import Highlight from 'components/Highlight'
import Icon from 'components/Icon'
import ClickCatcher from 'components/ClickCatcher'
import LinkPreview from '../LinkPreview'
import { sanitize, present, textLength, truncate } from 'hylo-utils/text'
import EventDate from '../EventDate'
import EventRSVP from '../EventRSVP'
import './PostBody.scss'
import Moment from 'moment'
import cx from 'classnames'

const maxDetailsLength = 144

export const formatDate = date => {
  return date
}

export default function PostBody ({
  post,
  respondToEvent,
  slug,
  expanded
}) {
  const isEvent = get('type', post) === 'event'

  const { startTime, location } = post

  if (isEvent) {
    return <div styleName='eventBody'>
      <EventDate {...post} />
      <div styleName='eventBodyColumn'>
        <PostBodyText {...post} slug={slug} hideDetails={!expanded} expanded={expanded} />
        <div styleName='eventData'>
          <Icon name='Clock' styleName='icon' /> {startTime}
        </div>
        <div styleName='eventData'>
          <Icon name='Location' styleName='icon' /> {location}
        </div>
      </div>
      <EventRSVP {...post} respondToEvent={respondToEvent} />
    </div>
  } else {
    return <PostBodyText {...post} expanded={expanded} slug={slug} />
  }
}

export function PostBodyText ({
  title,
  details,
  linkPreview,
  slug,
  expanded,
  className,
  highlightProps,
  fileAttachments,
  hideDetails
}) {
  title = decode(title)
  details = present(sanitize(details), {slug})
  if (!expanded && textLength(details) > maxDetailsLength) {
    details = truncate(details, maxDetailsLength)
  }

  return <Highlight {...highlightProps}>
    <div styleName={cx('body', {smallMargin: hideDetails})} className={className}>
      <div styleName='title' className='hdr-headline'>{title}</div>
      {details && !hideDetails &&
        <ClickCatcher>
          <div styleName='details' dangerouslySetInnerHTML={{__html: details}} />
        </ClickCatcher>
      }
      {linkPreview &&
        <LinkPreview {...pick(['title', 'url', 'imageUrl'], linkPreview)} />}
      {fileAttachments && <div styleName='file-attachments'>
        {fileAttachments.map(fileAttachment =>
          <a styleName='file-attachment'
            href={fileAttachment.url}
            target='_blank'
            key={fileAttachment.id}>
            <Icon name='Document' styleName='file-icon' />
            <span styleName='file-name'>{decodeURIComponent(path.basename(fileAttachment.url))}</span>
          </a>)}
      </div>}
    </div>
  </Highlight>
}
