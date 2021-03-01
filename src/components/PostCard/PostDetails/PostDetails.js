import React from 'react'
import { pick, get } from 'lodash/fp'
import { sanitize, present, textLength, truncate } from 'hylo-utils/text'
import Highlight from 'components/Highlight'
import ClickCatcher from 'components/ClickCatcher'
import CardFileAttachments from 'components/CardFileAttachments'
import LinkPreview from '../LinkPreview'
import PostCompletion from '../PostCompletion'
import cx from 'classnames'
import './PostDetails.scss'

const maxDetailsLength = 144

export default function PostDetails ({
  details,
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
  details = present(sanitize(details), { slug })
  if (!expanded && textLength(details) > maxDetailsLength) {
    details = truncate(details, maxDetailsLength)
  }

  const postType = get('type', post)
  const typesWithCompletion = ['offer', 'request', 'resource', 'project']
  const canBeCompleted = typesWithCompletion.includes(postType)
  const isFulfilled = get('fulfilledAt', post) !== null

  return <Highlight {...highlightProps}>
    <div styleName={cx('postDetails', { constrained })}>
      <div styleName='fade' />
      {details && !hideDetails &&
        <ClickCatcher>
          <div styleName='details' dangerouslySetInnerHTML={{ __html: details }} />
        </ClickCatcher>
      }
      {canBeCompleted && canEdit && expanded &&
        <PostCompletion
          type={postType}
          startTime={post.startTime}
          endTime={post.endTime}
          isFulfilled={isFulfilled}
          fulfillPost={fulfillPost}
          unfulfillPost={unfulfillPost} />}
      {linkPreview &&
        <LinkPreview {...pick(['title', 'url', 'imageUrl'], linkPreview)} />}
      {fileAttachments &&
        <CardFileAttachments attachments={fileAttachments} />}
    </div>
  </Highlight>
}
