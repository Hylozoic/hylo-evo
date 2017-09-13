import React from 'react'
import { decode } from 'ent'
import { pick } from 'lodash/fp'
import Highlight from 'components/Highlight'
import LinkPreview from '../LinkPreview'
import {
  sanitize, present, textLength, truncate, appendInP
} from 'hylo-utils/text'
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
  const decodedTitle = decode(title)
  let presentedDetails = present(sanitize(details), {slug})
  const shouldTruncate = !expanded &&
    textLength(presentedDetails) > maxDetailsLength
  if (shouldTruncate) {
    presentedDetails = truncate(presentedDetails, maxDetailsLength)
  }
  if (presentedDetails) presentedDetails = appendInP(presentedDetails, '&nbsp;')

  return <Highlight {...highlightProps}>
    <div styleName='body' className={className}>
      <div styleName='title' className='hdr-headline'>{decodedTitle}</div>
      {presentedDetails &&
        <div styleName='description'
          dangerouslySetInnerHTML={{__html: presentedDetails}} />}
      {linkPreview &&
        <LinkPreview {...pick(['title', 'url', 'imageUrl'], linkPreview)} />}
    </div>
  </Highlight>
}
