import React from 'react'
import { pick, get } from 'lodash/fp'
import { TextHelpers } from 'hylo-shared'
import Highlight from 'components/Highlight'
import ClickCatcher from 'components/ClickCatcher'
import CardFileAttachments from 'components/CardFileAttachments'
import LinkPreview from '../LinkPreview'
import PostCompletion from '../PostCompletion'
import cx from 'classnames'
import './PostDetails.scss'

const maxDetailsLength = 144

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
  let details = TextHelpers.present(TextHelpers.sanitize(providedDetails), { slug })
  if (!expanded && TextHelpers.textLength(details) > maxDetailsLength) {
    details = TextHelpers.truncate(details, maxDetailsLength)
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
