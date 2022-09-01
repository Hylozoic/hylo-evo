import React, { useEffect, useState } from 'react'
import { pick, get } from 'lodash/fp'
import { TextHelpers } from 'hylo-shared'
import ReactPlayer from 'react-player'
import HyloTipTapRender from 'components/HyloTipTapEditor/HyloTipTapRender'
import Highlight from 'components/Highlight'
import ClickCatcher from 'components/ClickCatcher'
import CardFileAttachments from 'components/CardFileAttachments'
import Feature from 'components/PostCard/Feature'
import LinkPreview from '../LinkPreview'
import PostCompletion from '../PostCompletion'
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

  const details = TextHelpers.presentHTML(providedDetails, {
    slug,
    truncate: !expanded && MAX_DETAILS_LENGTH,
    noLinks: false
  })
  const postType = get('type', post)
  const typesWithCompletion = ['offer', 'request', 'resource', 'project']
  const canBeCompleted = typesWithCompletion.includes(postType)
  const isFulfilled = get('fulfilledAt', post) !== null

  return (
    <Highlight {...highlightProps}>
      <div styleName={cx('postDetails', { constrained })}>
        <div styleName='fade' />
        {linkPreview?.url && isVideo && (
          <Feature url={linkPreview.url} />
        )}
        {details && !hideDetails && (
          <PostDetailsContent details={details} slug={slug} />
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
        {linkPreview && !isVideo && (
          <LinkPreview {...pick(['title', 'description', 'url', 'imageUrl'], linkPreview)} />
        )}
        {fileAttachments && (
          <CardFileAttachments attachments={fileAttachments} />
        )}
      </div>
    </Highlight>
  )
}

export function PostDetailsContent ({ details, slug }) {
  return (
    <ClickCatcher groupSlug={slug}>
      <div styleName='details' dangerouslySetInnerHTML={{ __html: details }} />
    </ClickCatcher>
  )
}

export function PostDetailsContentTipTap ({ details, slug }) {
  if (!details || details.length < 20) return null

  return (
    <ClickCatcher groupSlug={slug}>
      <HyloTipTapRender styleName='details' contentHTML={details} />
    </ClickCatcher>
  )
}
