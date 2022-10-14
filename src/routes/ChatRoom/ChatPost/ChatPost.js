import cx from 'classnames'
import { TextHelpers } from 'hylo-shared'
import { isEmpty, pick } from 'lodash/fp'
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import Avatar from 'components/Avatar'
import Highlight from 'components/Highlight'
import HyloHTML from 'components/HyloHTML'
import ClickCatcher from 'components/ClickCatcher'
import CardFileAttachments from 'components/CardFileAttachments'
import Feature from 'components/PostCard/Feature'
import LinkPreview from 'components/LinkPreview'
import { bgImageStyle } from 'util/index'
import { personUrl } from 'util/navigation'

import styles from './ChatPost.scss'

const MAX_DETAILS_LENGTH = 144

export default function ChatPost ({
  createdAt,
  creator,
  details: providedDetails,
  expanded,
  fileAttachments,
  forwardedRef,
  highlightProps,
  id,
  imageAttachments,
  isHeader,
  linkPreview,
  linkPreviewFeatured,
  showDetails,
  slug
}) {
  const [isVideo, setIsVideo] = useState()

  useEffect(() => {
    if (linkPreview?.url) {
      setIsVideo(ReactPlayer.canPlay(linkPreview?.url))
    }
  }, [linkPreview?.url])

  const details = expanded ? providedDetails : TextHelpers.truncateHTML(providedDetails, MAX_DETAILS_LENGTH)
  // const fileAttachments = attachments ? attachments.filter(a => a.type === 'file') : []
  // const imageAttachments = attachments ? attachments.filter(a => a.type === 'image') : []
  console.log("attach", imageAttachments)

  const openPost = event => {
    showDetails(id)
  }

  return (
    <Highlight {...highlightProps}>
      <div styleName='container' ref={forwardedRef} onClick={openPost}>
        {isHeader && (
          <>
            <Avatar url={personUrl(creator.id)} avatarUrl={creator.avatarUrl} className={styles.avatar} />
            <span styleName='name'>{creator.name}</span>
            <span styleName='date'>{TextHelpers.humanDate(createdAt)}</span>
          </>
        )}

        {linkPreview?.url && linkPreviewFeatured && isVideo && (
          <Feature url={linkPreview.url} />
        )}
        {details && (
          <ClickCatcher groupSlug={slug}>
            <HyloHTML styleName='details' html={details} />
          </ClickCatcher>
        )}
        {linkPreview && !linkPreviewFeatured && (
          <LinkPreview {...pick(['title', 'description', 'url', 'imageUrl'], linkPreview)} />
        )}
        <div styleName='images'>
          <div styleName='images-inner'>
            {!isEmpty(imageAttachments) && imageAttachments.map(image =>
              <a href={image.url} styleName='image' target='_blank' rel='noreferrer' key={image.url}>
                <div style={bgImageStyle(image.url)} />
              </a>)}
          </div>
        </div>
        {fileAttachments && fileAttachments.length > 0 && (
          <CardFileAttachments attachments={fileAttachments} />
        )}
      </div>
    </Highlight>
  )
}
