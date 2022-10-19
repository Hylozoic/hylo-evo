import React from 'react'
import cx from 'classnames'
import RoundImage from 'components/RoundImage'
import { TextHelpers } from 'hylo-shared'
import Highlight from 'components/Highlight'
import HyloHTML from 'components/HyloHTML'
import ClickCatcher from 'components/ClickCatcher'
import CardImageAttachments from 'components/CardImageAttachments'
import CardFileAttachments from 'components/CardFileAttachments'
import './CommentCard.scss'

export default function CommentCard ({
  comment,
  showDetails,
  expanded = true,
  highlightProps
}) {
  const { creator, post, slug, attachments } = comment
  const postTitle = post.title ? TextHelpers.truncateText(post.title, 25) : TextHelpers.truncateHTML(post.details, 25)

  const commentText = expanded ? comment.text : TextHelpers.truncateHTML(comment.text, 144)

  return (
    <span onClick={() => showDetails(comment.post.id)} styleName='link'>
      <div styleName={cx('comment-card', { expanded })}>
        <div styleName='comment-header'>
          <RoundImage url={creator.avatarUrl} styleName='profileImage' />
          <Highlight {...highlightProps}>
            <div styleName='comment-meta'>
              <span styleName='person-name'>{creator.name}</span> commented on&nbsp;
              <span styleName='post-title'>{postTitle}</span>
            </div>
          </Highlight>
          <span styleName='date'>{TextHelpers.humanDate(comment.createdAt)}</span>
        </div>
        <CardImageAttachments attachments={attachments} linked styleName='comment-images' />
        <CardFileAttachments attachments={attachments} styleName='comment-files' />
        <ClickCatcher groupSlug={slug}>
          <Highlight {...highlightProps}>
            <HyloHTML styleName='comment-body' html={commentText} />
          </Highlight>
        </ClickCatcher>
        <div styleName='comment-footer' />
      </div>
    </span>
  )
}
