import React from 'react'
import path from 'path'
import { pick } from 'lodash/fp'
import Highlight from 'components/Highlight'
import Icon from 'components/Icon'
import ClickCatcher from 'components/ClickCatcher'
import LinkPreview from '../LinkPreview'
import { sanitize, present, textLength, truncate } from 'hylo-utils/text'
import './PostDetails.scss'

const maxDetailsLength = 144

export default function PostDetails ({
  details,
  linkPreview,
  slug,
  expanded,
  highlightProps,
  fileAttachments,
  hideDetails
}) {
  details = present(sanitize(details), {slug})
  if (!expanded && textLength(details) > maxDetailsLength) {
    details = truncate(details, maxDetailsLength)
  }

  return <Highlight {...highlightProps}>
    <div styleName='postDetails'>
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
