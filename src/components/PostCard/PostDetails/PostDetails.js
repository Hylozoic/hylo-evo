import React from 'react'
import { pick } from 'lodash/fp'
import { TextHelpers } from 'hylo-shared'
import Highlight from 'components/Highlight'
import ClickCatcher from 'components/ClickCatcher'
import CardFileAttachments from 'components/CardFileAttachments'
import LinkPreview from '../LinkPreview'
import cx from 'classnames'
import './PostDetails.scss'

const MAX_DETAILS_LENGTH = 144

export default function PostDetails ({
  details: providedDetails,
  linkPreview,
  slug,
  constrained,
  expanded,
  highlightProps,
  fileAttachments,
  hideDetails,
  onClick,
  ...post
}) {
  const details = TextHelpers.presentHTML(providedDetails, {
    slug,
    truncate: !expanded && MAX_DETAILS_LENGTH
  })

  return <Highlight {...highlightProps}>
    <div onClick={onClick} styleName={cx('postDetails', { constrained })}>
      <div styleName='fade' />
      {details && !hideDetails && (
        <ClickCatcher>
          <div styleName='details' dangerouslySetInnerHTML={{ __html: details }} />
        </ClickCatcher>
      )}
      {linkPreview && (
        <LinkPreview {...pick(['title', 'url', 'imageUrl'], linkPreview)} />
      )}
      {fileAttachments && (
        <CardFileAttachments attachments={fileAttachments} />
      )}
    </div>
  </Highlight>
}
