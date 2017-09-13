import React from 'react'
import { decode } from 'ent'
import { pick } from 'lodash/fp'
import Highlight from 'components/Highlight'
import LinkPreview from '../LinkPreview'
import { sanitize, present, textLength, truncate } from 'hylo-utils/text'
import './PostBody.scss'

const maxDetailsLength = 144

export default function PostBody ({
  id,
  title,
  details,
  imageUrl,
  linkPreview,
  slug,
  expanded,
  className,
  highlightProps
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
    </div>
  </Highlight>
}
