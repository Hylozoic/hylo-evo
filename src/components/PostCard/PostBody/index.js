import React from 'react'
import { decode } from 'ent'
import path from 'path'
import { pick } from 'lodash/fp'
import Highlight from 'components/Highlight'
import Icon from 'components/Icon'
import LinkPreview from '../LinkPreview'
import { sanitize, present, textLength, truncate } from 'hylo-utils/text'
import './PostBody.scss'

const maxDetailsLength = 144

export default function PostBody ({
  id,
  title,
  details,
  linkPreview,
  slug,
  expanded,
  className,
  highlightProps,
  fileAttachments
}) {
  title = decode(title)
  details = present(sanitize(details), {slug})
  if (!expanded && textLength(details) > maxDetailsLength) {
    details = truncate(details, maxDetailsLength)
  }

  return <Highlight {...highlightProps}>
    <div styleName='body' className={className}>
      <div styleName='title' className='hdr-headline'>{title}</div>
      {details &&
        <div styleName='details' dangerouslySetInnerHTML={{__html: details}} />}
      {linkPreview &&
        <LinkPreview {...pick(['title', 'url', 'imageUrl'], linkPreview)} />}
      {fileAttachments && <div styleName='file-attachments'>
        {fileAttachments.map(fileAttachment =>
          <a styleName='file-attachment'
            href={fileAttachment.url}
            target='_blank'
            key={fileAttachment.id}>
            <Icon name='Document' styleName='file-icon' />
            <span styleName='file-name'>{path.basename(fileAttachment.url)}</span>
          </a>)}
      </div>}
    </div>
  </Highlight>
}
