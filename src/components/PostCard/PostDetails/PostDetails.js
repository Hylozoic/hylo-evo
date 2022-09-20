import React, { useEffect, useState } from 'react'
import { pick, get } from 'lodash/fp'
import { TextHelpers } from 'hylo-shared'
import ReactPlayer from 'react-player'
import HyloTipTapRender from 'components/HyloTipTapEditor/HyloTipTapRender'
import Highlight from 'components/Highlight'
import ClickCatcher from 'components/ClickCatcher'
import CardFileAttachments from 'components/CardFileAttachments'
import Feature from 'components/PostCard/Feature'
import LinkPreview from 'components/LinkPreview'
import PostCompletion from '../PostCompletion'
import cx from 'classnames'
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
  hideDetails,
  fulfillPost,
  unfulfillPost,
  canEdit,
  ...post
}) {
  const [isVideo, setIsVideo] = useState()

  useEffect(() => {
    if (linkPreview?.url) {
      const isVideo = ReactPlayer.canPlay(linkPreview?.url)
      setIsVideo(isVideo)
    }
  }, [linkPreview?.url])

  const details = expanded ? providedDetails : TextHelpers.truncateHTML(providedDetails, MAX_DETAILS_LENGTH)
  const postType = get('type', post)
  const typesWithCompletion = ['offer', 'request', 'resource', 'project']
  const canBeCompleted = typesWithCompletion.includes(postType)
  const isFulfilled = get('fulfilledAt', post) !== null

  return (
    <Highlight {...highlightProps}>
      <div styleName={cx('postDetails', { constrained })}>
        <div styleName='fade' />
        {linkPreview?.url && linkPreviewFeatured && isVideo && (
          <Feature url={linkPreview.url} />
        )}
        {details && !hideDetails && (
          <PostDetailsContent details={details} groupSlug={slug} />
        )}
        {canBeCompleted && canEdit && expanded && (
          <PostCompletion
            type={postType}
            startTime={post.startTime}
            endTime={post.endTime}
            isFulfilled={isFulfilled}
            fulfillPost={fulfillPost}
            unfulfillPost={unfulfillPost}
          />
        )}
        {linkPreview && !linkPreviewFeatured && (
          <LinkPreview {...pick(['title', 'description', 'url', 'imageUrl'], linkPreview)} />
        )}
        {fileAttachments && (
          <CardFileAttachments attachments={fileAttachments} />
        )}
      </div>
    </Highlight>
  )
}

export function PostDetailsContent ({ details, groupSlug }) {
  return (
    <ClickCatcher groupSlug={groupSlug}>
      <div styleName='details' dangerouslySetInnerHTML={{ __html: details }} />
    </ClickCatcher>
  )
}

export function PostDetailsContentTipTap ({ details, groupSlug }) {
  if (!details || details.length < 20) return null

  return (
    <ClickCatcher groupSlug={groupSlug}>
      <HyloTipTapRender styleName='details' contentHTML={details} />
    </ClickCatcher>
  )
}
