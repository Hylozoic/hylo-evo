import cx from 'classnames'
import React, { useEffect, useState } from 'react'
import { pick } from 'lodash/fp'
import { TextHelpers } from 'hylo-shared'
import ReactPlayer from 'react-player'
import Highlight from 'components/Highlight'
import HyloHTML from 'components/HyloHTML'
import ClickCatcher from 'components/ClickCatcher'
import CardFileAttachments from 'components/CardFileAttachments'
import Feature from 'components/PostCard/Feature'
import LinkPreview from 'components/LinkPreview'
import Tooltip from 'components/Tooltip'

import './PostDetails.scss'

const MAX_DETAILS_LENGTH = 144

export default function PostDetails ({
  details: providedDetails,
  linkPreview,
  linkPreviewFeatured,
  slug,
  constrained,
  expanded,
  highlightProps,
  fileAttachments,
  onClick,
  editedTimestamp,
  exactEditedTimestamp,
  ...post
}) {
  const [isVideo, setIsVideo] = useState()

  useEffect(() => {
    if (linkPreview?.url) {
      setIsVideo(ReactPlayer.canPlay(linkPreview?.url))
    }
  }, [linkPreview?.url])

  const details = expanded ? providedDetails : TextHelpers.truncateHTML(providedDetails, MAX_DETAILS_LENGTH)

  return (
    <Highlight {...highlightProps}>
      <div onClick={onClick} styleName={cx('postDetails', { constrained })}>
        <div styleName='fade' />
        {linkPreview?.url && linkPreviewFeatured && isVideo && (
          <Feature url={linkPreview.url} />
        )}
        {details && (
          <ClickCatcher groupSlug={slug}>
            <HyloHTML styleName='details' html={details} />
          </ClickCatcher>
        )}
        {editedTimestamp && (<div styleName='timestamp' data-for={`editedTip-${post.id}`} data-tip={exactEditedTimestamp}>
          {editedTimestamp}
        </div>)}
        {linkPreview && !linkPreviewFeatured && (
          <LinkPreview {...pick(['title', 'description', 'url', 'imageUrl'], linkPreview)} />
        )}
        {fileAttachments && (
          <CardFileAttachments attachments={fileAttachments} />
        )}
        <Tooltip
          delay={550}
          id={`editedTip-${post.id}`}
          position='left'
        />
      </div>
    </Highlight>
  )
}
