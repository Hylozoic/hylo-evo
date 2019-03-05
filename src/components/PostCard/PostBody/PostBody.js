import React from 'react'
import { decode } from 'ent'
import path from 'path'
import { pick, get } from 'lodash/fp'
import Highlight from 'components/Highlight'
import Icon from 'components/Icon'
import ClickCatcher from 'components/ClickCatcher'
import LinkPreview from '../LinkPreview'
import { sanitize, present, textLength, truncate } from 'hylo-utils/text'
import PostTitle from '../PostTitle'
import PostDetails from '../PostDetails'
import './PostBody.scss'
import cx from 'classnames'

const maxDetailsLength = 144

export const formatDate = date => {
  return date
}

export default function PostBody ({
  post,
  slug,
  expanded,
  className,
  highlightProps
}) {
  return <div styleName={cx('body', {smallMargin: !expanded})} className={className}>
    <PostTitle {...post} highlightProp={highlightProps} />
    <PostDetails {...post} slug={slug} highlightProp={highlightProps} hideDetails={!expanded} expanded={expanded} />
  </div>
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
